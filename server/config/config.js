//:::::::::::::::::::::
//puerto
//::::::::::::::::::
process.env.PORT = process.env.PORT || 3000;

//:::::::::::::::::::::
//entorno
//::::::::::::::::::
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

if (process.env.NODE_ENV === 'dev') {
    urlDB = "mongodb+srv://dakze:xm7GQHJr9ZG9mqDx@nodecluster-01giz.mongodb.net/cafe";
} else {
    urlDB = "mongodb+srv://dakze:xm7GQHJr9ZG9mqDx@nodecluster-01giz.mongodb.net/cafe";
}

process.env.URLDB = urlDB;