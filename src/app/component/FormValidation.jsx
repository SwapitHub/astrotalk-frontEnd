export const validateAstrologerForm = (formType) => {
  const errors = {};

  // Common fields for all forms
  const firstName = document.getElementById("fname")?.value.trim();
  const languages = document.getElementById("language")?.value;

  if (!firstName) errors.firstName = "Name is required";
  
  if (!languages || languages === "select language") {
    errors.languages = "Please select a language";
  }

  // Form-specific validations
  if (formType === "astrologer") {
    // Astrologer registration specific fields
    const dateOfBirth = document.getElementById("birthday")?.value;
    const skills = document.getElementById("Skills")?.value;
    const deviceUse = document.getElementById("deviceUse")?.value;
    const email = document.getElementById("emails")?.value.trim();
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const mobileNumber = document.getElementById("mobileNumber")?.value.trim();

    if (!dateOfBirth) {
      errors.dateOfBirth = "Date of Birth is required";
    } else {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--; // Adjust age if birthday hasn't occurred yet this year
      }

      if (age < 18) {
        errors.dateOfBirth =
          "Your age is lower than 18, so you are not allowed to continue further.";
      }
    }

    if (!skills || skills === "Please Select Option") {
      errors.skills = "Please select a skill";
    }

    if (!deviceUse || deviceUse === "select device") {
      errors.deviceUse = "Please select a device";
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Valid email is required";
    }

    if (!mobileNumber || mobileNumber.length !== 10) {
      errors.mobileNumber = "Valid 10-digit mobile number is required";
    }
    if (!gender) {
        errors.gender = "Gender is required";
      }
  }
  
  else if(formType === "astroProfile"){
    const professions = document.getElementById("profession")?.value;
    const Experience = document.getElementById("Experience")?.value.trim();
    const Charges = document.getElementById("Charges")?.value.trim();
    // const minute = document.getElementById("minute")?.value.trim();
    const imagePic = document.getElementById("image")?.value.trim();

if (!professions || professions === "Please select profession") {
    errors.professions = "Please select profession";
  }
    
    if(!Experience){
        errors.Experience = "Experience is required";
    }
    if(!Charges){
        errors.Charges = "Charges is required";
    }
    // if(!minute){
    //     errors.minute = "Minute is required";
    // }
    if(!imagePic){
        errors.imagePic = "Image is required";
    }
    
  }
  
  else if (formType === "user") {
    const dateOfBirthAny = document.getElementById("birthdayany")?.value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;

    if (!dateOfBirthAny) {
      errors.dateOfBirthAnys = "Date of Birth is required";
    }

    if (!searchAddress) {
      errors.placeOfBorn = "Place of birth is required";
    }
    if (!gender) {
        errors.gender = "Gender is required";
      }
  }

  return errors;
};
