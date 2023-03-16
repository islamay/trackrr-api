const twilioClient = {
    verify: jest.fn().mockResolvedValue({ success: true })
};

module.exports = twilioClient