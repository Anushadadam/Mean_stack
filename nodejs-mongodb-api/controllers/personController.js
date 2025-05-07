const Person = require('../models/person');

// Display all people
exports.listPeople = async (req, res) => {
  try {
    const people = await Person.find().sort({ name: 1 });
    
    // Handle API or HTML response
    if (req.accepts('html')) {
      res.render('person/list', { people });
    } else {
      res.json(people);
    }
  } catch (error) {
    console.error('Error retrieving people:', error);
    if (req.accepts('html')) {
      res.render('person/list', { people: [], error: 'Failed to retrieve people' });
    } else {
      res.status(500).json({ error: 'Failed to retrieve people' });
    }
  }
};

// Show create person form
exports.createPersonForm = (req, res) => {
  res.render('person/create', { person: {}, errors: {} });
};

// Create a new person
exports.createPerson = async (req, res) => {
  try {
    const person = new Person(req.body);
    await person.save();
    
    if (req.accepts('html')) {
      res.redirect('/person');
    } else {
      res.status(201).json(person);
    }
  } catch (error) {
    console.error('Error creating person:', error);
    
    if (req.accepts('html')) {
      res.render('person/create', { 
        person: req.body, 
        errors: error.errors || { general: { message: 'Failed to create person' } }
      });
    } else {
      res.status(400).json({ 
        error: 'Failed to create person', 
        details: error.errors 
      });
    }
  }
};

// Show edit person form
exports.editPersonForm = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    
    if (!person) {
      if (req.accepts('html')) {
        return res.redirect('/person');
      } else {
        return res.status(404).json({ error: 'Person not found' });
      }
    }
    
    res.render('person/edit', { person, errors: {} });
  } catch (error) {
    console.error('Error retrieving person for edit:', error);
    
    if (req.accepts('html')) {
      res.redirect('/person');
    } else {
      res.status(500).json({ error: 'Failed to retrieve person' });
    }
  }
};

// Update a person
exports.updatePerson = async (req, res) => {
  try {
    const person = await Person.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!person) {
      if (req.accepts('html')) {
        return res.redirect('/person');
      } else {
        return res.status(404).json({ error: 'Person not found' });
      }
    }
    
    if (req.accepts('html')) {
      res.redirect('/person');
    } else {
      res.json(person);
    }
  } catch (error) {
    console.error('Error updating person:', error);
    
    if (req.accepts('html')) {
      res.render('person/edit', { 
        person: { ...req.body, _id: req.params.id },
        errors: error.errors || { general: { message: 'Failed to update person' } }
      });
    } else {
      res.status(400).json({ 
        error: 'Failed to update person', 
        details: error.errors 
      });
    }
  }
};

// Show delete person confirmation
exports.deletePersonForm = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    
    if (!person) {
      return res.redirect('/person');
    }
    
    res.render('person/delete', { person });
  } catch (error) {
    console.error('Error retrieving person for delete:', error);
    res.redirect('/person');
  }
};

// Delete a person
exports.deletePerson = async (req, res) => {
  try {
    const person = await Person.findByIdAndDelete(req.params.id);
    
    if (!person) {
      if (req.accepts('html')) {
        return res.redirect('/person');
      } else {
        return res.status(404).json({ error: 'Person not found' });
      }
    }
    
    if (req.accepts('html')) {
      res.redirect('/person');
    } else {
      res.json({ message: 'Person deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting person:', error);
    
    if (req.accepts('html')) {
      res.redirect('/person');
    } else {
      res.status(500).json({ error: 'Failed to delete person' });
    }
  }
};