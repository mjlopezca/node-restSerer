//:::::::::::::::::::::
//puerto
//::::::::::::::::::
process.env.PORT = process.env.PORT || 3000;

//:::::::::::::::::::::
//entorno
//::::::::::::::::::
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

if (process.env.NODE_ENV === 'dev') {
    urlDB = "mongodb://localhost:27017/cafe";
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


//:::::::::::::::::::::
//fecha de expiracion token
//::::::::::::::::::
process.env.CADUCIDAD = '48h';


//:::::::::::::::::::::
//seed
//::::::::::::::::::
process.env.SEED = process.env.SEED || 'DESARROLLO-SEED';


//:::::::::::::::::::::
//seed
//::::::::::::::::::
process.env.CLEINTID = process.env.CLEINTID || '779180910643-310egtha4d54d8s02nqvv47us2kv8nug.apps.googleusercontent.com';