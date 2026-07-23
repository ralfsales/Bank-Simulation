import java.util.ArrayList;

public class Branch {
    private String name;
    private ArrayList<Customer> customers;

    public Branch(String name){
        this.name = name;
        this.customers = new ArrayList<Customer>();
    }

    public String getName(){
        return name;
    }

    public ArrayList<Customer> getCustomers(){
        return customers;
    }

    public Customer findCustomer(String name){
        for(Customer customer : customers){
            if(customer.getName().equalsIgnoreCase(name)){
                return customer;
            }
        }
        return null;
    }

    public boolean newCustomer(String name, double initialTransaction){
        Customer customer = findCustomer(name);
        if(customer == null){
            customers.add(new Customer(name,initialTransaction));
            return true;
        }
        return false;
    }

    public boolean addCustomerTransaction(String name, double transaction){
        Customer customer = findCustomer(name);
        if(customer != null){
            customer.addTransaction(transaction);
            return true;
        }
        return false;
    }
}
