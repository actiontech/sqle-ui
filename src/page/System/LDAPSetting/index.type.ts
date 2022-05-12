export type LDAPFormFields = {
  enable_ldap: boolean;
  enable_ssl: boolean;
  ldap_server_host?: string;
  ldap_server_port?: string;
  ldap_connect_dn?: string;
  ldap_connect_pwd?: string;
  ldap_search_base_dn?: string;
  ldap_user_name_rdn_key?: string;
  ldap_user_email_rdn_key?: string;
};
