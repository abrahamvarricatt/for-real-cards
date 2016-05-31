/**
 * Created by kenono on 2016-05-31.
 */
export interface MenuItemDefintion {
  id:string;
  parentId?: string;
  title?:string;
  context?:string[];
  componentNames?:string[];
  event?:string;
  type?:string;
  roles?:string[];
  position?:number;
  items?:MenuItem[];
  parent?:MenuItem;
  callback? (m:MenuItem):void;
}

export class MenuItem implements MenuItemDefintion {
  id:string;
  parentId: string;
  title:string;
  context:string[];
  componentNames:string[];
  event:string;
  type:string;
  roles:string[];
  position:number;
  items:MenuItem[];
  parent:MenuItem;
  callback(m:MenuItem):void{};
  //menu:MenuItemDefintion;
  constructor(options:MenuItemDefintion) {
    options.type = options.type || 'item';
    options.roles = options.roles || ['user', 'admin'];
    options.position = options.position || 0;
    options.items = options.items || [];
    _.extend(this, options);
    //this.menu=options;
  }
  shouldRender () {
    let user = Meteor.user();
    if (!!~this.roles.indexOf('*') || this.roles.length===0) {
      return true;
    } else {
      if (!user) {
        return false;
      }
      let roles:string[] = user.roles ? user.roles.concat('user') : ['user']; // Everyone is a user
      for (let userRoleIndex in roles) {
        for (let roleIndex in this.roles) {
          if (this.roles[roleIndex] === roles[userRoleIndex]) {
            return true;
          }
        }
      }
    }
    return false;
  };
}
