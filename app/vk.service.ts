declare var nw: any;
declare var $: any;
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export class UserInfo {
  public id: number = 0;
  public first_name: string = '';
  public last_name: string = '';
  public photo_50: string = '';
}

export class GroupInfo {
  public name: string = '';
  public id: number = 0; 
  public photo_50: string = '';
}

@Injectable()
export class VkService  {
  private _url:String = 'https://oauth.vk.com/authorize?client_id=5387802&display=popup&redirect_uri=close.html&response_type=token&scope=groups,friends';
  private _accessToken: String;
  private _authStarted: boolean = false;
  
  private _user: UserInfo;
  
  constructor() {
    this.authorize().subscribe( vt => { });
  }
  
  private createAwaitingObservable( finalFunc: any ) {
    return new Observable(observe => {
      let func = () => {
        if (!this._accessToken) {
          setTimeout(func, 1000);
        } else {
          finalFunc(observe);
        }
      }
      func.call(this);
    });
  }
  
  public getCurrentUser():Observable<UserInfo> {
    return this.createAwaitingObservable( observe => {
      this.call('users.get', {}).subscribe( (user: UserInfo[]) => {
        this._user = user[0];
        observe.next(this._user);
      });      
    });
  }
  
  public getUserGroups():Observable<GroupInfo[]> {
    return this.createAwaitingObservable( observe => {
      this.call('groups.get', {
        extended: 1,
        filter: 'admin'
      }).subscribe( response => {
        observe.next(response.items);
      });            
    });
  }
  
  public getGroupUsers(id: string):Observable<UserInfo[]> {
    return this.createAwaitingObservable( observe => {
      this.call('groups.getMembers', {
        group_id: id,
        fields: 'first_name, last_name, photo_50'
      }).subscribe( response => {
        observe.next(response.items);
      });
    });
  }
  
  public authorize():Observable<String> {
    return new Observable<String>(observer => {
      if (this._accessToken) {
        observer.next(this._accessToken);
        return ;
      }
      if (global['nw']) {  
        nw.Window.open( this._url, {position: 'center',width: 500,height: 500},
          (win) => win.on('loaded', () => {
            let parseResult = (/access_token=([0-9a-f]*)/gi).exec(win.window.location.hash);
            if (parseResult) {
              this._accessToken = parseResult[1];
              if (this._accessToken) {
                this._authStarted = false;
                observer.next(this._accessToken);
              }
            }
          })
        );
      } else {
        this._accessToken = ''; 
        this._authStarted = false;
        observer.next(this._accessToken);
      }
    });
  }
  
  logout(): Observable<void> {
    return new Observable<void>( (observer) => observer.next() );
  }
  
  public call(methodName, params):Observable<any> {
    var url = 'https://api.vk.com/method/' + methodName;
    var paramsArray = [];
    for (var keyName in params) {
      if (params.hasOwnProperty(keyName)) {
        paramsArray.push(keyName + '=' + params[keyName]);
      }
    }
    if (this._accessToken && !params.access_token) {
      paramsArray.push("access_token=" + this._accessToken);
    }
    if (!params.v) {
      paramsArray.push("v=5.52");
    }
    if (paramsArray.length > 0) {
      url += '?' + paramsArray.join('&');
    }
    return new Observable<any>((observer) => {
      $.ajax({
        url: url,
        type: "GET",
        dataType: "jsonp",
        success: function (msg) {
          if (msg.error) {
            if (msg.error.error_code === 14) {
              $('#captchaErrorModal').modal('show');
              $('#captchaErrorModal img.question').attr('src', msg.error.captcha_img);
              $('#captchaErrorModal button.answerBtn')[0].onclick = function () {
                this.call(methodName, $.extend({},
                  params, {
                    captcha_sid: msg.error.captcha_sid,
                    captcha_key: $('#captchaErrorModal .answer').val()
                  }))
                  .then(function (msg2) {
                    if (msg2.response) {
                      observer.next(msg2.response);
                    } else {
                      observer.next(msg2);
                    }
                  })
                  .catch(function (msg2) {
                    observer.error(msg2.error);
                  });
              }
            } else {
              $('#commonErrorModal').modal('show')
              $('#commonErrorModal .message').html(JSON.stringify(msg.error));
              observer.error(msg.error);
            }
          } else {
            if (msg.response) {
              observer.next(msg.response);
            } else {
              observer.next(msg);
            }
          }
        }
      });
    });
  }
}