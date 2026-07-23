import java.util.ArrayList;

public class Bank {
    private String name;
    private ArrayList<Branch> branches;

    public Bank(String name){
        this.name = name;
        this.branches = new ArrayList<Branch>();
    }

    private Branch findBranch(String nameBranch){
        for(Branch branch : branches){
            if(branch.getName().equalsIgnoreCase(nameBranch)){
                return branch;
            }
        }
        return null;
    }

    public boolean addBranch(String nameBranch){
        Branch branch = findBranch(nameBranch);
        if(branch == null){
            branches.add(new Branch(nameBranch));
            return true;
        }
        return false;
    }

    public boolean addCustomer(String nameBranch, String nameCustomer, double initialTransaction){
        Branch branch = findBranch(nameBranch);
        if(branch != null){
            return branch.newCustomer(nameCustomer,initialTransaction);
        }
        return false;
    }

    public boolean addCustomerTransaction(String branchName, String customerName, double amount) {

        Branch branch = findBranch(branchName);
        if (branch != null) {
            return branch.addCustomerTransaction(customerName, amount);
        }
        return false;
    }

    public boolean listCustomers(String nameBranch,boolean printTransactions){
        Branch branch = findBranch(nameBranch);
        if(branch != null){
            System.out.println("\nCustomer details for branch "+nameBranch);
            ArrayList<Customer> branchCustomers = branch.getCustomers();
            for(int i = 0; i < branchCustomers.size(); i++){
                Customer customer = branchCustomers.get(i);
                System.out.println("\nCustomer: " + customer.getName() + " ["+(i)+"]");
                if(printTransactions){
                    System.out.println("Transactions:");
                    ArrayList<Double> transactions = customer.getTransactions();
                    for(int j = 0; j < transactions.size(); j++){
                        System.out.printf("[%d] Amount $%f%n",(j+1),transactions.get(j));
                    }
                }
            }
            return true;
        }
        return false;
    }
}
