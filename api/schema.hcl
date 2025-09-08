table "account" {
  schema = schema.public
  column "id" {
    null = false
    type = text
  }
  column "accountId" {
    null = false
    type = text
  }
  column "providerId" {
    null = false
    type = text
  }
  column "userId" {
    null = false
    type = text
  }
  column "accessToken" {
    null = true
    type = text
  }
  column "refreshToken" {
    null = true
    type = text
  }
  column "idToken" {
    null = true
    type = text
  }
  column "accessTokenExpiresAt" {
    null = true
    type = timestamp
  }
  column "refreshTokenExpiresAt" {
    null = true
    type = timestamp
  }
  column "scope" {
    null = true
    type = text
  }
  column "password" {
    null = true
    type = text
  }
  column "createdAt" {
    null    = false
    type    = timestamp
    default = sql("CURRENT_TIMESTAMP")
  }
  column "updatedAt" {
    null = false
    type = timestamp
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key "account_userId_fkey" {
    columns     = [column.userId]
    ref_columns = [table.user.column.id]
    on_update   = NO_ACTION
    on_delete   = CASCADE
  }
}
table "session" {
  schema = schema.public
  column "id" {
    null = false
    type = text
  }
  column "expiresAt" {
    null = false
    type = timestamp
  }
  column "token" {
    null = false
    type = text
  }
  column "createdAt" {
    null    = false
    type    = timestamp
    default = sql("CURRENT_TIMESTAMP")
  }
  column "updatedAt" {
    null = false
    type = timestamp
  }
  column "ipAddress" {
    null = true
    type = text
  }
  column "userAgent" {
    null = true
    type = text
  }
  column "userId" {
    null = false
    type = text
  }
  column "impersonatedBy" {
    null = true
    type = text
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key "session_userId_fkey" {
    columns     = [column.userId]
    ref_columns = [table.user.column.id]
    on_update   = NO_ACTION
    on_delete   = CASCADE
  }
  unique "session_token_key" {
    columns = [column.token]
  }
}
table "user" {
  schema = schema.public
  column "id" {
    null = false
    type = text
  }
  column "name" {
    null = false
    type = text
  }
  column "email" {
    null = false
    type = text
  }
  column "emailVerified" {
    null = false
    type = boolean
  }
  column "image" {
    null = true
    type = text
  }
  column "createdAt" {
    null    = false
    type    = timestamp
    default = sql("CURRENT_TIMESTAMP")
  }
  column "updatedAt" {
    null    = false
    type    = timestamp
    default = sql("CURRENT_TIMESTAMP")
  }
  column "role" {
    null = true
    type = text
  }
  column "banned" {
    null = true
    type = boolean
  }
  column "banReason" {
    null = true
    type = text
  }
  column "banExpires" {
    null = true
    type = timestamp
  }
  column "username" {
    null = true
    type = text
  }
  column "displayUsername" {
    null = true
    type = text
  }
  primary_key {
    columns = [column.id]
  }
  unique "user_email_key" {
    columns = [column.email]
  }
  unique "user_username_key" {
    columns = [column.username]
  }
}
table "verification" {
  schema = schema.public
  column "id" {
    null = false
    type = text
  }
  column "identifier" {
    null = false
    type = text
  }
  column "value" {
    null = false
    type = text
  }
  column "expiresAt" {
    null = false
    type = timestamp
  }
  column "createdAt" {
    null    = false
    type    = timestamp
    default = sql("CURRENT_TIMESTAMP")
  }
  column "updatedAt" {
    null    = false
    type    = timestamp
    default = sql("CURRENT_TIMESTAMP")
  }
  primary_key {
    columns = [column.id]
  }
}
schema "public" {
  comment = "standard public schema"
}
