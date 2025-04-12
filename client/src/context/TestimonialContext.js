import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const TestimonialContext = createContext();

// Custom hook for using the testimonial context
export const useTestimonials = () => useContext(TestimonialContext);

// Provider component
export const TestimonialProvider = ({ children }) => {  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      text: "The craftsmanship of my Islamic attire from TrioBazar is exceptional. The attention to detail and quality of the fabric exceeded my expectations. Perfect for both daily wear and special occasions.",
      name: "Aminah Hassan",
      role: "Regular Customer",
      gender: "female"
    },
    {
      id: 2,
      text: "I ordered a custom Abaya for my wedding reception and it was absolutely stunning. The team understood my vision perfectly and delivered a piece that made me feel elegant and confident.",
      name: "Fatima Rahman",
      role: "Satisfied Bride",
      gender: "female"
    },
    {
      id: 3,
      text: "As someone who values both modesty and style, TrioBazar has been a game-changer. Their modern takes on traditional Islamic wear are exactly what I've been looking for.",
      name: "Ibrahim Ahmed",
      role: "Business Professional",
      gender: "male"
    },
    {
      id: 4,
      text: "The quality of their thobes is outstanding. The fit is perfect and the fabric is so comfortable for daily wear. I've already recommended TrioBazar to all my friends.",
      name: "Yusuf Mohammad",
      role: "Loyal Customer",
      gender: "male"
    }
  ]);  // Initialize with sample testimonials

  // Load testimonials from localStorage on initial render
  useEffect(() => {
    const storedTestimonials = localStorage.getItem('testimonials');
    console.log('Loading testimonials from localStorage:', storedTestimonials);
    if (storedTestimonials) {
      try {
        const parsed = JSON.parse(storedTestimonials);
        setTestimonials(parsed);
        console.log('Successfully loaded testimonials:', parsed);
      } catch (error) {
        console.error('Error parsing testimonials:', error);
      }
    }
  }, []);

  // Save testimonials to localStorage whenever they change
  useEffect(() => {
    console.log('Saving testimonials to localStorage:', testimonials);
    localStorage.setItem('testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  // Add a new testimonial
  const addTestimonial = (testimonial) => {
    const newTestimonial = {
      ...testimonial,
      id: Date.now()
    };
    setTestimonials([...testimonials, newTestimonial]);
  };

  // Update an existing testimonial
  const updateTestimonial = (updatedTestimonial) => {
    setTestimonials(
      testimonials.map(item => 
        item.id === updatedTestimonial.id ? updatedTestimonial : item
      )
    );
  };

  // Delete a testimonial
  const deleteTestimonial = (id) => {
    setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
  };

  // Get avatar based on gender
  const getAvatarByGender = (gender) => {
    return gender === "female"
      ? "https://cdn.pixabay.com/photo/2014/04/02/14/10/female-306407_960_720.png" 
      : "https://cdn.pixabay.com/photo/2014/04/02/14/10/male-306408_960_720.png";
  };

  const value = {
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getAvatarByGender
  };

  return (
    <TestimonialContext.Provider value={value}>
      {children}
    </TestimonialContext.Provider>
  );
};
