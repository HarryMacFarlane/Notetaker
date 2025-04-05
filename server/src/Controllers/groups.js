import dbRunner from '../Storage/storage.js';
import apiController from './interface.js';
import { GroupModel } from '../Models/index.js';

const groupController = new apiController();

groupController.index = async (req, res) => {
    try {
        return await dbRunner.indexResource(req.userID, 'groups')
        .then((groups) => {
            return groups.array.forEach(data => {
                const dataModel = new GroupModel(data);
                return JSON.stringify(dataModel);
            });
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
        return await dbRunner.getResource(req.userID, 'groups', id).then((data) => {
            if (data) {
                
                const dataModel = new GroupModel(data);
                return res.status(200).json(dataModel.get_serialize());
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