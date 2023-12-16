from celery import shared_task
from .models import Product, Category
import flask_excel as excel
from .mail_service import send_message
from .models import User, Role, Orders_Desc, Order_Details
from jinja2 import Template
import pandas as pd


@shared_task(ignore_result=False)
def create_resource_csv():
    sales_data = (Category.query.join(Product, Product.CID == Category.CID)\
    .join(Order_Details, Order_Details.PID == Product.PID)\
    .join(Orders_Desc, Orders_Desc.OID == Order_Details.OID)\
    .with_entities(
        Orders_Desc.Date,
        Category.Name,
        Product.Name,
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
    for date, category, product, quantity in sales_data:
        sales_by_date.append({
            'Date': date,
            'Category': category,
            'Product': product,
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
            
    #print(sales_data)
    #print(categories)
    #print(products)
    #print(cat_to_prod)
    #print(prod_to_cat)
    
    # Query category-wise sales using the model class directly
    c_sales = {}
    for c in categories:
        c_sales[c] = 0
    
    # Query product-wise sales using the model class directly
    p_sales = {}
    for p in products:
        p_sales[p] = 0
        
    for d, c, p, q in sales_data:
        c_sales[c] += q
        p_sales[p] += q

    print("\n\n------------")
    #print(c_sales)
    #print(p_sales)
    
    category_sales = {'Category':[], 'TotalSales':[]}
    for c in c_sales:
        category_sales['Category'].append(c)
        category_sales['TotalSales'].append(c_sales[c])
        
    product_sales = {'Product':[], 'Category':[], 'TotalSales':[]}
    for p in p_sales:
        product_sales['Product'].append(p)
        product_sales['Category'].append(prod_to_cat[p])
        product_sales['TotalSales'].append(p_sales[p])
    
    # Convert the data to pandas DataFrame for easier manipulation
    category_sales_df = pd.DataFrame(category_sales, columns=['Category', 'TotalSales'])
    product_sales_df = pd.DataFrame(product_sales, columns=['Product', 'Category', 'TotalSales'])
    
    print(category_sales_df, product_sales_df)
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
def daily_reminder(to, subject):
    users = User.query.filter(User.roles.any(Role.name == 'admin')).all()
    for user in users:
        with open('test.html', 'r') as f:
            template = Template(f.read())
            send_message(user.email, subject,
                        template.render(email=user.email))
    return "OK"
