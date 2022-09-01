const fs = require('fs');

const pathChat = __dirname + '/chat.json'

class Chat {

    async getMessages() {
        const messages = await fs.promises.readFile(pathChat, "utf-8");
        if (!messages) {
            const arrayMessages = [];
            fs.writeFileSync(pathChat, JSON.stringify(arrayMessages));
            return arrayMessages;
        }
        const datos = JSON.parse(messages);
        return datos;
    } catch (error) {
        throw error;
    }


    async saveMessages(obj) {
        try {
            const array = await this.getMessages()
                .then((res) => res)
                .catch((error) => {
                    throw error;
                });
            array.push(obj);
            const data = JSON.stringify(array);
            fs.writeFileSync(pathChat, data, "utf-8");
            return obj;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Chat;