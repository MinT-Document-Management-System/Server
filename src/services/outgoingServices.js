const Outgoing = require("../models/outgoingModel")

class OutgoingServices {

    async create_outgoing( metadata, document_id ){
        try {
            const date_written = metadata.date_written || NULL;
            const date_sent = metadata.date_sent || NULL;

            const receiver_body = metadata.receiver_body;
            const sender_department_id = metadata.sender_department_id;
            
            if( !document_id || !sender_department_id || !receiver_body){
                const error = new Error("Required fields are missing");
                error.status = 400; throw error;
            }
            const created_letter = await Outgoing.create({document_id, receiver_body, sender_department_id, date_written, date_sent })
            return created_letter

        } catch (error) {
            error.message = `Outgoing letter creation failed: ${error.message}`
            throw error
        }

    }
}
module.exports = new OutgoingServices();
