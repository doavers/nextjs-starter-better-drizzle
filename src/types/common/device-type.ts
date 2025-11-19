type DeviceType = {
  id?: string;
  host_id: string;
  device_id: string;
  cust_phone: string;
  cust_name: string;
  cust_email: string;
  device_type: string;
  os?: string;
  os_version?: string;
  app_version?: string;
  push_token?: string;
  location_lat?: number;
  location_lng?: number;
  ip_address?: string;
  status?: string;
  last_login_at?: string | Date;
  accept_tnc_at?: string | Date;
  created_at?: string | Date;
  updated_at?: string | Date;
  deleted_at?: string | Date;
  deleted_by?: string;
};

export default DeviceType;
