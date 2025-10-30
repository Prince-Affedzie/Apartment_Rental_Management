const { Tenants } = require("../Models/Tenants");
const { Apartment } = require("../Models/Apartments");
const { default: mongoose } = require("mongoose");

const addRentRecord = async (req, res) => {
  try {
    const {
      tenantName,
      tenantPhone,
      roomDescription,
      rentedDate,
      expirationDate,
      noOfMonthsRented,
      amountPaidOnUtility,
      monthlyPrice,
      totalAmount,
      status,
      apartment,
    } = req.body;
    console.log("req.userId:", req.userId);
    console.log("req.body:", req.body);
    ``;

    const record = new Tenants({
      tenantName: tenantName,
      tenantPhone: tenantPhone,
      roomDescription: roomDescription,
      apartment: apartment,
      rentedDate: rentedDate,
      expirationDate: expirationDate,
      noOfMonthsRented: noOfMonthsRented,
      amountPaidOnUtility: amountPaidOnUtility,
      monthlyPrice: monthlyPrice,
      totalAmount: totalAmount,
      status: status,
      userId: req.userId,
    });
    // if (apartment) {
    //   await Apartment.findByIdAndUpdate(
    //     apartment,
    //     { $push: { tenants: record._id } },
    //     { new: true }
    //   );
    // }
    if (apartment) {
      await Apartment.findOneAndUpdate(
        { _id: apartment, userId: req.userId },
        { $push: { tenants: record._id } },
        { new: true }
      );
    }
    await record.save();
    res.status(200).json({ message: "Record Created Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editRecord = async (req, res) => {
  try {
    const { Id } = req.params;
    const update = req.body;
   
  
    const idObject = new mongoose.Types.ObjectId(Id);
    
    const record = await Tenants.findOne({ _id:idObject, userId: req.userId });
    if (!record) {
      return res.status(404).json({ message: "No Record Found" });
    }

    // //  Handle the case where the tenant is moving to a new apartment
    // const oldApartmentId = record.apartment
    //   ? record.apartment.toString()
    //   : null;
    // const newApartmentId = req.body.apartment
    //   ? req.body.apartment.toString()
    //   : null;

    // if (newApartmentId && newApartmentId !== oldApartmentId) {
    //   // Remove the tenant from the old apartment's list
    //   if (oldApartmentId) {
    //     await Apartment.findByIdAndUpdate(oldApartmentId, {
    //       $pull: { tenants: record._id }, // $pull removes a value from an array
    //     });
    //   }

    //   // Add the tenant to the new apartment's list
    //   await Apartment.findByIdAndUpdate(newApartmentId, {
    //     $push: { tenants: record._id }, // $push adds a value to an array
    //   });
    // }

    const oldApartmentId = record.apartment
      ? record.apartment.toString()
      : null;
    const newApartmentId = req.body.apartment
      ? req.body.apartment._id.toString()
      : null;

    if (newApartmentId && newApartmentId !== oldApartmentId) {
      if (oldApartmentId) {
        await Apartment.findOneAndUpdate(
          { _id: oldApartmentId, userId: req.userId },
          { $pull: { tenants: record._id } }
        );
      }
      await Apartment.findOneAndUpdate(
        { _id: newApartmentId, userId: req.userId },
        { $push: { tenants: record._id } }
      );
    }

    // 3. Apply all the other updates to the tenant record itself
    Object.assign(record, update);

    // 4. Save the updated tenant record
    await record.save();

    res.status(200).json({ message: "Record Updated Successfully" });
  } catch (err) {
    console.error(err); // Use console.error for better visibility in logs
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const { Id } = req.params;
    const record = await Tenants.findOneAndDelete({
      _id: Id,
      userId: req.userId,
    });
    if (!record) {
      return res.status(404).json({ message: "No Record Found" });
    }
    await record.deleteOne();
    res.status(200).json({ message: "Record removed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getRentRecords = async (req, res) => {
  try {
    const rents = await Tenants.find({ userId: req.userId })
      .populate("apartment")
      .sort({ createdAt: -1 });
    res.status(200).json(rents);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getRentRecord = async (req, res) => {
  try {
    const { Id } = req.params;
    const rent = await Tenants.findOne({
      _id: Id,
      userId: req.userId,
    }).populate("apartment");
    if (!rent) {
      return res.status(404).json({ message: "No Rent Found" });
    }
    res.status(200).json(rent);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addApartment = async (req, res) => {
  try {
    console.log(req.body);
    const { title, price, location, description, status, tenants } = req.body;
    const property = new Apartment({
      title: title,
      price: price,
      location: location,
      description: description,
      tenants: tenants || [],
      status: status,
      userId: req.userId,
    });
    if (tenants.length > 0) {
      await Tenants.updateMany(
        // { _id: { $in: tenants } },
        { _id: { $in: tenants }, userId: req.userId },
        { $set: { apartment: property._id } }
      );
    }
    await property.save();
    res.status(200).json({ message: "Apartment Added Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchApartmentProperties = async (req, res) => {
  try {
    const apartments = await Apartment.find({ userId: req.userId })
      .populate("tenants")
      .sort({ createdAt: -1 });

    res.status(200).json(apartments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editProperty = async (req, res) => {
  try {
    const { Id } = req.params;
    const { title, location, price, description, status, tenants } = req.body;

    console.log(req.body);

    //  Find the property and check for existence
    const property = await Apartment.findOne({ _id: Id, userId: req.userId });
    if (!property) {
      return res.status(404).json({ message: "Property Not Found" });
    }

    // Store the original tenants array for comparison
    const originalTenants = property.tenants.map((t) => t.toString()); // Convert to strings for easy comparison
    const newTenants = tenants ? tenants.map((t) => t.toString()) : [];

    //  Identify tenants to be removed and added
    const tenantsToRemove = originalTenants.filter(
      (tenantId) => !newTenants.includes(tenantId)
    );
    const tenantsToAdd = newTenants.filter(
      (tenantId) => !originalTenants.includes(tenantId)
    );

    //  Update the tenant records in the Tenants collection

    // Remove tenants from the old apartment (set their apartment field to null)
    if (tenantsToRemove.length > 0) {
      await Tenants.updateMany(
        { _id: { $in: tenantsToRemove } },
        { $set: { apartment: null } }
      );
    }

    // Add the new tenants to this apartment
    if (tenantsToAdd.length > 0) {
      await Tenants.updateMany(
        { _id: { $in: tenantsToAdd } },
        { $set: { apartment: property._id } }
      );
    }

    // 4. Update the apartment document itself
    // Note: Using `Object.assign` is a great way to handle dynamic updates
    Object.assign(property, {
      title: title || property.title,
      location: location || property.location,
      price: price || property.price,
      description: description || property.description,
      status: status || property.status,
      tenants: newTenants, // Directly set the new list of tenant IDs
    });

    //  Save the updated property document
    await property.save();

    res.status(200).json({ message: "Property Updated Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { Id } = req.params;
    const property = await Apartment.findOneAndDelete({
      _id: Id,
      userId: req.userId,
    });
    if (!property) {
      return res.status(400).json({ message: "No Property Found" });
    }
    await property.deleteOne();
    res.status(200).json({ message: "No Property Found" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getApartment = async (req, res) => {
  try {
    const { Id } = req.params;
    const apartment = await Apartment.findOne({
      _id: Id,
      userId: req.userId,
    }).populate("tenants", "tenantName tenantPhone tenantEmail");
    console.log(apartment);
    if (!apartment) {
      return res.status(400).json({ message: "No Apartment Found" });
    }
    res.status(200).json(apartment);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Server Error - Could not fetch apartment" });
  }
};

const getApartmentTenants = async (req, res) => {
  const { apartmentId } = req.params;

  try {
    const tenants = await Apartment.findOne({
      _id: apartmentId,
      userId: req.userId,
    }).populate("tenants");
    console.log(tenants.tenants);
    res.status(200).json(tenants.tenants);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addRentRecord,
  editRecord,
  deleteRecord,
  getRentRecords,
  getRentRecord,
  addApartment,
  fetchApartmentProperties,
  editProperty,
  deleteProperty,
  getApartment,
  getApartmentTenants,
};
