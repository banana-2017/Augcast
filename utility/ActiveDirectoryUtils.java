// Login with LDAP
import java.util.Hashtable;
import javax.naming.Context;
import javax.naming.NamingException;
import javax.naming.ldap.LdapContext;
import javax.naming.ldap.InitialLdapContext;

// Writing to logfile
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

// Datetime
import java.util.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
/**
 * Utility Class for connecting to UCSD Active Directory credentials.
 *
 * Taken from http://www.javaxt.com/Tutorials/Windows/How_to_Authenticate_Users_with_Active_Directory.
 */
public class ActiveDirectoryUtils {

    private static final String UCSD_ACTIVE_DIRECTORY_DOMAIN = "ad.ucsd.edu";

    private ActiveDirectoryUtils() {
    }

    /**
     * Returns true if the email/password combination is valid for UCSD's
     * Active Directory login system. This is the same as your ucsd email credentials.
     *
     * @param email  the @ucsd.edu email address to use
     * @param password  the password to check with
     * @return  true if authentication was successful.
     */
    public static boolean checkUcsdPassword(String email, String password) {
        try {
            String username = email.split("@")[0];
            LdapContext context = getConnection(username, password, UCSD_ACTIVE_DIRECTORY_DOMAIN);
            return true;
        }
        catch (NamingException exception) {
            // Ldap uses a NamingException to communicate authentication failure
            return false;
        }
    }

    public static LdapContext getConnection(String username, String password, String domainName) throws NamingException {
        return getConnection(username, password, domainName, null);
    }

    public static LdapContext getConnection(String username, String password, String domainName, String serverName) throws NamingException {
        Hashtable properties = new Hashtable();

        // set up username and password
        String principalName = username + "@" + domainName;
        properties.put(Context.SECURITY_PRINCIPAL, principalName);
        if (password != null) {
            properties.put(Context.SECURITY_CREDENTIALS, password);
        }

        // set up the connection information
        String endpoint = serverName != null ? serverName + "." + domainName : domainName;
        String ldapURL = "ldap://" + endpoint + '/';
        properties.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
        properties.put(Context.PROVIDER_URL, ldapURL);

        // try to actually connect
        try{
            return new InitialLdapContext(properties, null);
        }
        catch(javax.naming.CommunicationException e){
            NamingException exp = new NamingException("Failed to connect to " + endpoint);
            exp.setRootCause(e);
            throw exp;
        }
        catch(NamingException e){
            NamingException exp = new NamingException("Failed to authenticate " + principalName + " through " + endpoint);
            exp.setRootCause(e);
            throw exp;
        }
    }

    public static void main(String[] args) {
        // Log incoming authentication attempts
        boolean result = checkUcsdPassword(args[0], args[1]);
        DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        String toLog = dateFormat.format(new Date()) + "\t" + args[0] + "\t" + result + "\n";
        appendToLog(toLog);

        // Print result to stdout, to be picked up by webserver's SSH client
        System.out.println(result);
    }

    public static void appendToLog(String toAppend) {

		BufferedWriter bw = null;
		FileWriter fw = null;

        String header = "TIME\t\t\tUSER\t\t\tSUCCESS\n";

		try {

			File file = new File("logins.log");
            boolean writeHeader = false;

			// if file doesnt exists, then create it
			if (!file.exists()) {
				file.createNewFile();
                writeHeader = true;
			}

			// true = append file
			fw = new FileWriter(file.getAbsoluteFile(), true);
			bw = new BufferedWriter(fw);

            if (writeHeader) {
                bw.write(header);
            }
			bw.write(toAppend);

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				if (bw != null)
					bw.close();
				if (fw != null)
					fw.close();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
	}
}
