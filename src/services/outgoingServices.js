const Outgoing = require("../models/outgoingModel")

class OutgoingServices {

    async create_outgoing( metadata ){
        try {
            const date_written = metadata.date_written;
            const date_sent = new Date().toLocaleString();
            const document_id = metadata.document_id;
            const receiver_body = metadata.receiver_body;
            const sender_department_id = metadata.sender_department_id;
            if(!date_sent||!date_written||!document_id||!sender_department_id||!receiver_body){
                const error = new Error("Required fields are missing");
                error.status(400)
            }
            const created_letter = await Outgoing.create({document_id,receiver_body,date_sent,sender_department_id,date_written})
            return created_letter

        } catch (error) {
            error.message = `Outgoing letter creation failed:${error.message}`
            throw error
        }

    }
}
module.exports = new OutgoingServices();
