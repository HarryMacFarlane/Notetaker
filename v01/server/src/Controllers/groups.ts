import apiController from './interface.js';
import { GroupModel } from '../Models/index.js';

const groupController = new apiController();

groupController.index = async (req, res) => {
    const groups = new GroupModel({userID: req.userID})
    try {
        const return_serialize = groups.index_serialize();
        res.status(200).json(return_serialize);
    }
    catch (e) {
        console.error(e);
        res.status(500).json(JSON.stringify({error: 'There was an issue on our end. Try again later!'}))
    }
}


groupController.get = async (req, res) => {
    const { id } = req.params
    const Group = new GroupModel({id: id});
    try {
        const serialized_return = Group.get_serialize();
        res.status(200).json(serialized_return);
    }
    catch (e) {
        console.error(e);
        res.status(500).json(JSON.stringify({error: 'Problem on our end. Try again later!'}))
    }
}

groupController.post = async (req, res) => {
    const inputs = JSON.parse(req.body)
    const Group = new GroupModel(inputs);
    try {
        serialized_return = Group.post_serialize(inputs);
        res.status(201).json(serialized_return);
    }
    catch (e) {
        console.error(e);
        res.status(500).json(JSON.stringify({error: 'Problem on our end. Try again later!'}))
    }
}

groupController.patch = async (req, res) => {}

groupController.delete = async (req, res) => {}

export default groupController;