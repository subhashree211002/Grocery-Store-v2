from celery import shared_task
from .models import Product, Category
import flask_excel as excel
from .mail_service import send_message
from .models import User, Role, Orders_Desc, Order_Details
from jinja2 import Template
import pandas as pd
from datetime import datetime


@shared_task(ignore_result=False)
def create_resource_csv():
    sales_data = (Category.query.join(Product, Product.CID == Category.CID)\
    .join(Order_Details, Order_Details.PID == Product.PID)\
    .join(Orders_Desc, Orders_Desc.OID == Order_Details.OID)\
    .with_entities(
        Orders_Desc.Date,
        Category.Name,
        Product.Name,
        Product.Stock,
        Order_Details.Qty
    )
    .filter(Orders_Desc.Status == 0)
    .order_by(Orders_Desc.Date)
    .all()
    )
    sales_by_date = []
    categories = []
    products = []
    cat_to_prod = {}
    prod_to_cat = {}
    prod_stock ={}
    for date, category, product, stock, quantity in sales_data:
        sales_by_date.append({
            'Date': date,
            'Category': category,
            'Product': product,
            'Stock': stock,
            'Quantity': quantity
        })
        
        if category not in categories:
            cat_to_prod[category] = []
            categories.append(category)
        elif product not in cat_to_prod[category]:
            cat_to_prod[category].append(product)
        
        if product not in products:
            products.append(product)
            
        prod_to_cat[product] = category
        prod_stock[product] = stock
            
    #print(sales_data)
    #print(categories)
    #print(products)
    #print(cat_to_prod)
    #print(prod_to_cat)
    #print(prod_stock)
    
    
    # Query category-wise sales using the model class directly
    c_sales = {}
    for c in categories:
        c_sales[c] = 0
    
    # Query product-wise sales using the model class directly
    p_sales = {}
    for p in products:
        p_sales[p] = 0
        
    for d, c, p, s, q in sales_data:
        c_sales[c] += q
        p_sales[p] += q

    #print("\n\n------------")
    #print(c_sales)
    #print(p_sales)
    
    category_sales = {'Category':[], 'TotalSales':[]}
    for c in c_sales:
        category_sales['Category'].append(c)
        category_sales['TotalSales'].append(c_sales[c])
        
    product_sales = {'Product':[], 'Category':[], 'TotalSales':[], 'Stock Left': []}
    for p in p_sales:
        #print(p, prod_to_cat[p], prod_stock[p])
        product_sales['Product'].append(p)
        product_sales['Category'].append(prod_to_cat[p])
        product_sales['TotalSales'].append(p_sales[p])
        product_sales['Stock Left'].append(prod_stock[p])
    
    # Convert the data to pandas DataFrame for easier manipulation
    category_sales_df = pd.DataFrame(category_sales, columns=['Category', 'TotalSales'])
    product_sales_df = pd.DataFrame(product_sales, columns=['Product', 'Category', 'TotalSales', 'Stock Left'])
    
    #print(category_sales_df, product_sales_df)
    filename = 'sales_summary.xlsx'

    # Create an Excel writer
    with pd.ExcelWriter(filename, engine='xlsxwriter') as writer:
        # Write the first DataFrame to Sheet1
        product_sales_df.to_excel(writer, sheet_name='Sheet1', index=False)

        # Write the second DataFrame to Sheet2
        category_sales_df.to_excel(writer, sheet_name='Sheet2', index=False)
    
    #stud_res = StudyResource.query.with_entities(
    #    StudyResource.topic, StudyResource.description).all()
    """stud_res = Category.query.with_entities(Category.CID, Category.Name).all()
    csv_output = excel.make_response_from_query_sets(
        stud_res, ["CID", "Name"], "csv")
    filename = "test.csv"

    with open(filename, 'wb') as f:
        f.write(csv_output.data)"""

    return filename


@shared_task(ignore_result=True)
def monthly_report(to, subject):
    users = User.query.filter(User.roles.any(Role.name == 'buyer')).all()
    for user in users:
        user_info = {
            "CurrentDate": datetime.now().strftime("%Y-%m-%d"),           
            'UserName': user.username,
            'orders': [],
            "TotalOrders": len(user.orders),
            "TotalExpenditure": 0.0,
        }

        # Fetch order-related data for each user
        for order in user.orders:
            if order.Status == 1:
                continue
            order_info = {
                'OrderDate': order.Date,
                "TotalAmount": order.Expense,
                'orderedProducts': []
            }

            # Fetch product-related data for each order
            for order_detail in order.products:
                product_info = {
                    'product': order_detail.product.Name,
                    'quantity': order_detail.Qty
                }

                order_info['orderedProducts'].append(product_info)

            user_info['orders'].append(order_info)
            user_info["TotalExpenditure"] += order_info["TotalAmount"]
        with open('report.html', 'r') as f:
            template = Template(f.read())
            send_message(user.email, subject,
                        template.render(**user_info))
    return "OK"


@shared_task(ignore_result=True)
def daily_reminder(to, subject):
    users = User.query.filter(User.roles.any(Role.name == 'buyer')).all()
    for user in users:
        today = datetime.now().strftime("%Y-%m-%d")
        flag = 0
        for ord in user.orders:
            if (str(ord.Date) == today):
                flag = 1
        if flag == 1:
            continue
        with open('reminder.html', 'r') as f:
            template = Template(f.read())
            send_message(user.email, subject,
                        template.render(username =  user.username))
    return "OK"