import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaGraduationCap,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowUp,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-base-300 text-base-content border-t border-base-content/10">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <FaGraduationCap className="text-primary text-3xl" />
              <h2 className="text-2xl font-bold tracking-wide">Learnify</h2>
            </div>
            <p className="text-sm opacity-80 leading-relaxed max-w-md">
              Learnify is a next-generation Learning Management System built to
              help students upskill, track learning progress, and prepare for
              real-world careers through structured courses and assessments.
            </p>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              <a className="btn btn-circle btn-outline btn-sm hover:btn-primary">
                <FaFacebookF />
              </a>
              <a className="btn btn-circle btn-outline btn-sm hover:btn-primary">
                <FaInstagram />
              </a>
              <a className="btn btn-circle btn-outline btn-sm hover:btn-primary">
                <FaLinkedinIn />
              </a>
              <a className="btn btn-circle btn-outline btn-sm hover:btn-primary">
                <FaGithub />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="footer-title">Platform</h3>
            <NavLink to="/" className="link link-hover">Home</NavLink>
            <NavLink to="/courses" className="link link-hover">Courses</NavLink>
            <NavLink to="/assignments" className="link link-hover">Assignments</NavLink>
            <NavLink to="/contact" className="link link-hover">Contact</NavLink>
          </div>

          {/* Student */}
          <div>
            <h3 className="footer-title">Student</h3>
            <NavLink to="/learning" className="link link-hover">My Learning</NavLink>
            <NavLink to="/progress" className="link link-hover">Progress</NavLink>
            <NavLink to="/profile" className="link link-hover">Profile</NavLink>
            <NavLink to="/help" className="link link-hover">Help Desk</NavLink>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer-title">Support</h3>
            <p className="flex items-center gap-2 text-sm mt-2">
              <FaEnvelope className="text-primary" />
              support@learnify.com
            </p>
            <p className="flex items-center gap-2 text-sm mt-2">
              <FaPhoneAlt className="text-primary" />
              +91 98765 43210
            </p>
            <p className="flex items-center gap-2 text-sm mt-2">
              <FaMapMarkerAlt className="text-primary" />
              Bhopal, India
            </p>
          </div>

        </div>

        {/* Divider */}
        <div className="divider my-12"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          <p className="text-sm opacity-70 text-center md:text-left">
            © {new Date().getFullYear()} Learnify. All rights reserved.
            <span className="ml-2">|</span>
            <span className="ml-2">Built for students & educators</span>
          </p>

          {/* Back to Top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="btn btn-outline btn-sm flex items-center gap-2"
          >
            <FaArrowUp />
            Back to top
          </button>

        </div>
      </div>
    </footer>
  );
};

export default Footer;