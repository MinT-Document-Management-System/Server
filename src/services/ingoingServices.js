const Ingoing = require("../models/ingoingModel")

class IngoingServices {

    async create_ingoing( metadata ){
        try {
            const date_written = metadata.date_written;
            const date_forwarded = new Date().toLocaleString();
            const document_id = metadata.document_id;
            const sender_body = metadata.sender_body;
            if(!date_forwarded||!date_written||!document_id||!sender_body){
                const error = new Error("Required fields are missing");
                error.status(400)
            }
            const created_letter = await Ingoing.create({document_id,sender_body,date_forwarded,date_written})
            return created_letter

        } catch (error) {
            error.message = `Ingoing letter creation failed:${error.message}`
            throw error
        }

    }
}
module.exports = new IngoingServices();
