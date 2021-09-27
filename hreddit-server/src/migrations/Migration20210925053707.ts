import { Migration } from '@mikro-orm/migrations';

export class Migration20210925053707 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_name" text not null, "email" text not null, "pass_word" varchar(255) not null);');
    this.addSql('alter table "user" add constraint "user_user_name_unique" unique ("user_name");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

}
