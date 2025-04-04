import dbRunner from '../Storage/storage.js';
import apiController from './interface.js';

const groupController = new apiController();

groupController.index = async (req, res) => {
    try {
        return await dbRunner.indexResource(req.userID, 'groups')
        .then((groups) => {
            return (groups) ? 
            res.status(200).json(JSON.stringify(groups)) :
            res.status(404).json({ message: 'No groups found!' });
        })
        // This will catch serialization errors
        .catch((e) => {
            return res.status(500).json({ message: 'Something went wrong on our side!' });
        })
    }
    // This will catch dbRunner errors
    catch (error) {
        return res.status(error.status).json({ message: error.message});
    }
}


groupController.get = async (req, res) => {
    const id = req.params.id;
    try {
        return await dbRunner.getResource(req.userID, 'groups', id).then((group) => {
            if (group) {
                return res.status(200).json(JSON.stringify(group));
            }
            else {
                return res.status(404).json({ message: 'Group not found' });
            }
        });
    }
    catch (error) {
        return res.status(error.status).json({ message: error.message});
    }

}

groupController.post = async (req, res) => {

}

groupController.patch = async (req, res) => {

}

groupController.delete = async (req, res) => {

}



export default groupController;