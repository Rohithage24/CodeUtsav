import React, { useState, useEffect } from 'react';

export default function LoginModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: Mobile, 2: OTP
  const [phone, setPhone] = useState("");

  // Reset the step whenever the modal is opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPhone("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = (e) => {
    e.preventDefault();
    if (phone.length === 10) setStep(2);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation prevents the modal from closing when you click the card itself */}
      <div className="modal-card-glass" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={onClose}>&times;</button>
        
        <div className="modal-content">
          <div className="modal-icon">{step === 1 ? "📱" : "🔐"}</div>
          <h2>{step === 1 ? "Welcome Back" : "Verify OTP"}</h2>
          <p className="modal-subtitle">
            {step === 1 
              ? "Enter your mobile to access your library" 
              : `Code sent to +91 ${phone}`}
          </p>

          {step === 1 ? (
            <form onSubmit={handleNext} className="modal-form">
              <div className="input-box-glass">
                <span className="country-code">+91</span>
                <input 
                  type="tel" 
                  placeholder="Mobile Number" 
                  maxLength="10"
                  autoFocus
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>
              <button type="submit" className="btn-primary full-width">Send OTP</button>
            </form>
          ) : (
            <div className="otp-flow">
              <div className="otp-grid">
                {[0, 1, 2, 3].map((i) => (
                  <input 
                    key={i} 
                    type="text" 
                    maxLength="1" 
                    className="otp-input"
                    autoFocus={i === 0}
                    onKeyUp={(e) => {
                      if (e.target.value && e.target.nextSibling) e.target.nextSibling.focus();
                      if (e.key === "Backspace" && e.target.previousSibling) e.target.previousSibling.focus();
                    }}
                  />
                ))}
              </div>
              <button className="btn-primary full-width" onClick={onClose}>
                Verify & Login
              </button>
              <p className="resend-link">
                Didn't receive it? <span className="text-gradient pointer">Resend</span>
              </p>
              <button className="back-link" onClick={() => setStep(1)}>Change Number</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}