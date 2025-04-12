import mongoose from 'mongoose';
const Schema = mongoose.Schema;
class DB {
    static database;

    static async start() {
        if (!this.database) {
            this.database = mongoose.connect('mongodb+srv://rekberariez:8jut0JfILYhpNtjd@wabot.yi0dtso.mongodb.net/waBot?appName=waBot')
                .then(() => {
                    console.log('Connected with Database')
                }).catch((err) => {
                    console.log(err);
                });
        }

        return this.database;
    }

    static async Owner() {
        const schema = new Schema({
            id: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }, { timestamps: true });

        return mongoose.models.Owner || mongoose.model('Owner', schema);
    }

    static async Setup() {
        const schema = new Schema({
            selfmode: {
                type: Boolean,
                required: true
            },
            antitoxic: {
                type: Boolean,
                required: true,
                default: true
            },
            antinsfw: {
                type: Boolean,
                required: true,
                default: true
            },
            antispam: {
                type: Boolean,
                required: true,
                default: true
            },
            antilink: {
                type: Boolean,
                required: true,
                default: false
            },
            antisticker: {
                type: Boolean,
                required: true,
                default: false
            }
        }, { timestamp: true });

        return mongoose.models.Setup || mongoose.model('Setup', schema);
    }

    static async DropDB() {
        await mongoose.connection.dropDatabase();
    }
}

export { DB };
