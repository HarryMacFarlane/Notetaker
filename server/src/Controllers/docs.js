import apiController from './interface.js';
import { DocModel } from '../Models/index.js';

const docController = new apiController();

docController.index = async (req, res) => {}
docController.get = async (req, res) => {}
docController.post = async (req, res) => {}
docController.patch = async (req, res) => {}
docController.delete = async (req, res) => {}

export default docController;