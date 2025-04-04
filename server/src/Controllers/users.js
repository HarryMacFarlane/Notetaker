import dbRunner from '../Storage/storage.js';
import apiController from './interface.js';

const userController = new apiController();

userController.get = async (req, res) => {
    try {
        
        return (sucess) ? res.status(200).json({ message: 'Profile updated successfully!'})
        : res.status(400)
        return res.status(200).json(user);
    } catch (error) {
        return res.status(404).send(error.message);
    }
}

export default userController;