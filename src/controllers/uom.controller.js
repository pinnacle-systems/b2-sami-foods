import {
  getAllUoms,
  getUomById,
  createUom,
  updateUom,
  deleteUom,
} from '../services/uom.service.js';

export const getAll = async (req, res, next) => {
  try {
    const data = await getAllUoms();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const data = await getUomById(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name, shortCode, status } = req.body;
    
    // Status in req.body might be a string ('true' / 'false' / 'Active' / 'Inactive')
    // We convert it cleanly to a Boolean
    let boolStatus = true;
    if (status === false || status === 'false' || status === 'Inactive') {
      boolStatus = false;
    }

    const data = await createUom({
      name,
      shortCode,
      status: boolStatus,
    });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const { name, shortCode, status } = req.body;

    let boolStatus = undefined;
    if (status !== undefined) {
      boolStatus = true;
      if (status === false || status === 'false' || status === 'Inactive') {
        boolStatus = false;
      }
    }

    const data = await updateUom(req.params.id, {
      name,
      shortCode,
      status: boolStatus,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const data = await deleteUom(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
