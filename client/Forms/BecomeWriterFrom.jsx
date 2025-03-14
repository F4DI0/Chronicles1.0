import { useState } from "react";
import "../styles/form.css"; // ✅ Import the CSS file

function BecomeWriterForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    profilePicture: null,
    writingExperience: "",
    contentSpecialization: [],
    yearsExperience: "",
    portfolioLinks: [""],
    writingSamples: [],
    motivation: "",
    topics: "",
    guidelinesAgreement: false,
    feedbackAgreement: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileUpload = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files });
  };

  const handlePortfolioChange = (index, value) => {
    const newLinks = [...formData.portfolioLinks];
    newLinks[index] = value;
    setFormData({ ...formData, portfolioLinks: newLinks });
  };

  const addPortfolioLink = () => {
    setFormData({ ...formData, portfolioLinks: [...formData.portfolioLinks, ""] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Application submitted successfully!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="form-container">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Become a Writer</h2>
        <p className="text-gray-400 text-center mb-6">Fill in the form below to apply as a writer.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="fullName" placeholder="Full Name" className="input-field" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email Address" className="input-field" onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Phone Number" className="input-field" onChange={handleChange} required />
            <input type="text" name="country" placeholder="Country & City" className="input-field" onChange={handleChange} required />
          </div>

          <input type="file" name="profilePicture" className="input-file" onChange={handleFileUpload} />

          <label className="text-white font-semibold">Writing Experience</label>
          <select name="yearsExperience" className="input-field" onChange={handleChange}>
            <option value="">Select</option>
            <option value="<1">Less than a year</option>
            <option value="1-2">1-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value=">5">5+ years</option>
          </select>

          {formData.portfolioLinks.map((link, index) => (
            <input key={index} type="url" placeholder="Portfolio Link" className="input-field" onChange={(e) => handlePortfolioChange(index, e.target.value)} />
          ))}
          <button type="button" className="text-yellow-400 font-bold" onClick={addPortfolioLink}>+ Add More Links</button>

          <label className="text-white font-semibold">Attach Writing Samples</label>
          <input type="file" name="writingSamples" multiple className="input-file" onChange={handleFileUpload} />

          <textarea name="motivation" placeholder="Why do you want to write for us?" className="input-textarea" onChange={handleChange} required></textarea>
          <input type="text" name="topics" placeholder="Topics you specialize in" className="input-field" onChange={handleChange} />

          <label className="checkbox-container">
            <input type="checkbox" name="guidelinesAgreement" onChange={handleChange} />
            <span>Do you agree to follow our editorial guidelines?</span>
          </label>
          <label className="checkbox-container">
            <input type="checkbox" name="feedbackAgreement" onChange={handleChange} />
            <span>Are you open to receiving feedback and revisions?</span>
          </label>

          <button type="submit" className="submit-button">Submit Application</button>
        </form>
      </div>
    </div>
  );
}

export default BecomeWriterForm;
