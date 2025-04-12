import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useTestimonials } from '../../context/TestimonialContext';
import './Admin.css';

const TestimonialManager = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useTestimonials();

  const [formData, setFormData] = useState({
    id: null,
    text: '',
    name: '',
    role: '',
    gender: 'male'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting testimonial:', formData);

    if (isEditing) {
      // Update existing testimonial
      updateTestimonial(formData);
      setIsEditing(false);
    } else {
      // Add new testimonial
      const testimonialToAdd = {
        ...formData,
        text: formData.text.trim(),
        name: formData.name.trim(),
        role: formData.role.trim()
      };
      console.log('Adding new testimonial:', testimonialToAdd);
      addTestimonial(testimonialToAdd);
    }

    // Reset the form
    setFormData({
      id: null,
      text: '',
      name: '',
      role: '',
      gender: 'male'
    });
  };

  const editTestimonial = (testimonial) => {
    setFormData(testimonial);
    setIsEditing(true);
  };
  const handleDeleteTestimonial = (id) => {
    deleteTestimonial(id);
  };

  // In a real application, you would use useEffect to load testimonials from your API
  useEffect(() => {
    // Example API call:
    // const fetchTestimonials = async () => {
    //   const response = await fetch('/api/testimonials');
    //   const data = await response.json();
    //   setTestimonials(data);
    // };
    // fetchTestimonials();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-section">
        <h2>Manage Testimonials</h2>

        {/* Add/Edit Testimonial Form */}
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>

          <div className="form-group">
            <label htmlFor="name">Client Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter client name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Client Role/Title</label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              placeholder="e.g. Business Executive, Satisfied Customer"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender (for avatar)</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="text">Testimonial</label>
            <textarea
              id="text"
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Enter the client testimonial text"
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Testimonial' : 'Add Testimonial'}
          </button>

          {isEditing && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  id: null,
                  text: '',
                  name: '',
                  role: '',
                  gender: 'male'
                });
              }}
            >
              Cancel
            </button>
          )}
        </form>

        {/* Testimonials List */}
        <div className="admin-data-list">
          <h3>Existing Testimonials</h3>
          {testimonials.length === 0 ? (
            <p>No testimonials available.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Gender</th>
                  <th>Testimonial</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((testimonial) => (<tr key={testimonial.id}>
                  <td>
                    <div className="testimonial-name-cell">
                      <img
                        src={testimonial.gender === 'female'
                          ? "https://cdn.pixabay.com/photo/2014/04/02/14/10/female-306407_960_720.png"
                          : "https://cdn.pixabay.com/photo/2014/04/02/14/10/male-306408_960_720.png"
                        }
                        alt={`${testimonial.name} avatar`}
                        className="testimonial-avatar"
                      />
                      <span>{testimonial.name}</span>
                    </div>
                  </td>
                  <td>{testimonial.role}</td>
                  <td>{testimonial.gender}</td>
                  <td className="testimonial-text-cell">
                    {testimonial.text.length > 100
                      ? `${testimonial.text.substring(0, 100)}...`
                      : testimonial.text}
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon edit"
                      onClick={() => editTestimonial(testimonial)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDeleteTestimonial(testimonial.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default TestimonialManager;
