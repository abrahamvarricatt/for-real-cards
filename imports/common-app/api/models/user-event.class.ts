/**
 * Created by kenono on 2016-05-31.
 */
import { Subject, Subscription} from 'rxjs';
import {User} from "./user.model";
import { AccountTools } from "../services/account-tools";

export enum UserEventType {
  LOGIN,                // 0 
  LOG_OUT_REQUEST,      // 1
  LOGOUT,               // 2
  AVATAR_UPDATE,        // 3
  DISPLAY_NAME_UPDATE   // 4
}

export class UserEvent {
  private static loginStatusSubject:Subject = new Subject();
  private static userCursor:Mongo.Cursor;

  eventType: UserEventType;
  userId:string;
  imageURL:string;
  displayName: string;
  constructor(eventType:UserEventType, data: {userId?:string, imageURL?:string, displayName?:string} = {}) {
    this.eventType=eventType;
    this.userId = data.userId;
    this.imageURL = data.imageURL;
    this.displayName = data.displayName;
  }
  
  static pushEvent(userEvent:UserEvent):void {
    return UserEvent.loginStatusSubject.next(userEvent);
  }

  static subscribe(onNext:(event:UserEvent)=>void, onError:(error:any)=>void=null, onComplete:()=>void=null):Subscription {
    return UserEvent.loginStatusSubject.subscribe(onNext, onError, onComplete)
  }

  static pushAvatarValue(user:User) {
    UserEvent.pushEvent(
      new UserEvent(UserEventType.AVATAR_UPDATE, {
        userId: user._id,
        imageURL: AccountTools.getAvatarURL(user)
      })
    );
  }

  static pushDisplayNameValue(user:User) {
    UserEvent.pushEvent(
      new UserEvent(UserEventType.DISPLAY_NAME_UPDATE, {
        userId: user._id,
        displayName: AccountTools.getDisplayNameNoLookup(user)
      })
    );
  }


  static startObserving(onNext:(event:UserEvent)=>void, onError:(error:any)=>void=null, onComplete:()=>void=null):Subscription {
    let returnValue:Subscription = UserEvent.loginStatusSubject.subscribe(onNext, onError, onComplete);
    Tracker.autorun(
      ()=>{
        if (!UserEvent.userCursor) {
          UserEvent.userCursor = Meteor.users.find();
          UserEvent.userCursor.observeChanges({
            added: (_id, doc:User)=>{
              UserEvent.pushAvatarValue(doc);
              UserEvent.pushDisplayNameValue(doc);
            },
            changed:(_id,doc)=>{
              console.error('DOC CHANGE HANDLER NEEDS IMPLEMENTATION');
              console.error(doc);
//              UserEvent.pushAvatarValue(user);
//              UserEvent.pushDisplayNameValue(user);
            }
          });
        } else {
          UserEvent.userCursor.forEach((user:User)=>{
            UserEvent.pushAvatarValue(user);
            UserEvent.pushDisplayNameValue(user);
          })
        }
      }
    );
    return returnValue;
  }
}
UserEvent.subscribe((event:UserEvent)=> {
  if (event.eventType ===  UserEventType.LOG_OUT_REQUEST)
    AccountTools.logOut();
});