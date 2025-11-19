export type Menu = {
  id: number | string;
  title: string;
  path?: string;
  newTab: boolean;
  isLogedin?: boolean;
  userRoles?: string[];
  submenu?: Menu[];
};
