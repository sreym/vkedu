declare var openDatabase : any; 
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LocalDbService  {
  private db: any; 
  
  constructor() {
    this.db = openDatabase('mydb', '1.0', 'my first database', 2 * 1024 * 1024);
    
    this.db.transaction(function (tx) {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS "names"("id" Integer unique primary key, "first_name" Text NOT NULL, "last_name" Text NOT NULL)',
        [],
        undefined,
        (tx, err) => console.error(err)
      );
    });
  }
  
  public saveName(id, first_name, last_name) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        'UPDATE "names" SET first_name = ?, last_name = ? WHERE id = ?', 
        [first_name, last_name, id],
        undefined,
        (tx, err) => console.error(err)
      );
    });
  }
  
  public newName(id, first_name, last_name) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO "names" VALUES (?, ?, ?)', 
        [id, first_name, last_name],
        undefined,
        (tx, err) => console.error(err)
      );
    });        
  }
  
  public newOrReplaceName(id, first_name, last_name) {
    this.db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM "names" WHERE id = ?', [id], (tx, res) => {
        console.log('newOrReplaceName');
        let n = res.rows.length;

        if (n > 0) {
          tx.executeSql(
            'UPDATE "names" SET first_name = ?, last_name = ? WHERE id = ?', 
            [first_name, last_name, id],
            undefined,
            (tx, err) => console.error(err)
          );
        } else {
          tx.executeSql(
            'INSERT INTO "names" VALUES (?, ?, ?)', 
            [id, first_name, last_name],
            undefined,
            (tx, err) => console.error(err)
          );
        }
      });

    });        
    
  }
  
  public getNames(ids: number[]) {
    return new Observable<any[]>(observer => {
      let result = [];
      let qchars = ids.map(()=>'?').join(',');
      this.db.transaction(function (tx) {
        tx.executeSql(
          `SELECT * FROM "names" WHERE id IN (${qchars})`, 
          ids,
          (tx, res) => {
            for(let i = 0; i < res.rows.length; i++) {
              result.push(res.rows.item(i));
            }
          }, 
          (tx, err) => console.error(err)
        );
        observer.next(result);      
      });
    });
  }
  
  public getUser(id) {
    return new Observable<any>(observer => {
      this.db.transaction(function (tx) {
        tx.executeSql(
          `SELECT * FROM "names" WHERE id = ?`, [id],
          (tx, res) => {
            if(res.rows.length > 0) {
              observer.next(res.rows.item(0));
            } else {
              observer.next(null);
            }
          }, 
          (tx, err) => console.error(err)
        );
      });      
    });    
  }
  
}
