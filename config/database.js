export default function setupDB() {
    return db = new Database(
        {
            'config': {
                'autoSave': true,
                'collectionsFolder': '/collection/',
                'dataFile': 'database.json'
            }
        }
    );
}