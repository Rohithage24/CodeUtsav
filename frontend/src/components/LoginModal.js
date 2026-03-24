import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthProvider'

const BASE_URL = 'http://localhost:5000'

export default function LoginModal ({ isOpen, onClose }) {
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', '']) // 6 digits
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [auth, setAuth] = useAuth()

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setPhone('')
      setOtp(['', '', '', '', '', ''])
      setError('')
    }
  }, [isOpen])

  if (!isOpen) return null

  // ── Step 1: Send OTP ───────────────────────────────────────────────────────
  const handleSendOtp = async e => {
    e.preventDefault()
    setError('')

    if (phone.length !== 10) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/api/user/sendOtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: `+91${phone}` })
      })
      const data = await res.json()
      console.log(data)

      if (!res.ok) {
        setError(data.message || 'Failed to send OTP. Try again.')
        return
      }

      setStep(2)
    } catch (err) {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: Verify OTP ─────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    setError('')
    const otpString = otp.join('')

    if (otpString.length !== 6) {
      setError('Enter the full 6-digit OTP.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/api/user/verifyOtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // allows httpOnly cookie to be set
        body: JSON.stringify({ mobile: `+91${phone}`, otp: otpString })
      })
      const data = await res.json()
      console.log(data)

      if (!res.ok) {
        setError(data.message || 'Invalid OTP. Try again.')
        return
      }
      if (data?.token) {
        const authData = {
          user: data.data.user,
          token: data.token
        }

        // Save in context
        setAuth(authData)

        // Save in localStorage
        localStorage.setItem('auth', JSON.stringify(authData))
      }

      onClose()
    } catch (err) {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  const handleResend = async () => {
    setError('')
    setOtp(['', '', '', '', '', ''])
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/api/user/sendOtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: `+91${phone}` })
      })
      const data = await res.json()
      if (!res.ok) setError(data.message || 'Failed to resend OTP.')
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  // ── OTP input box handler ──────────────────────────────────────────────────
  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return // digits only
    const updated = [...otp]
    updated[index] = value
    setOtp(updated)

    // Auto-focus next box
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-card-glass' onClick={e => e.stopPropagation()}>
        <button className='close-x' onClick={onClose}>
          &times;
        </button>

        <div className='modal-content'>
          <div className='modal-icon'>{step === 1 ? '📱' : '🔐'}</div>
          <h2>{step === 1 ? 'Welcome Back' : 'Verify OTP'}</h2>
          <p className='modal-subtitle'>
            {step === 1
              ? 'Enter your mobile to access your library'
              : `Code sent to +91 ${phone}`}
          </p>

          {/* Error message */}
          {error && (
            <p
              style={{
                color: '#ef4444',
                fontSize: 13,
                margin: '0 0 12px',
                textAlign: 'center'
              }}
            >
              {error}
            </p>
          )}

          {step === 1 ? (
            // ── Mobile input ─────────────────────────────────────────────────
            <form onSubmit={handleSendOtp} className='modal-form'>
              <div className='input-box-glass'>
                <span className='country-code'>+91</span>
                <input
                  type='tel'
                  placeholder='Mobile Number'
                  maxLength='10'
                  autoFocus
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
              <button
                type='submit'
                className='btn-primary full-width'
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            // ── OTP input ────────────────────────────────────────────────────
            <div className='otp-flow'>
              <div className='otp-grid'>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type='text'
                    inputMode='numeric'
                    maxLength='1'
                    className='otp-input'
                    autoFocus={i === 0}
                    value={digit}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => handleOtpKeyDown(e, i)}
                  />
                ))}
              </div>

              <button
                className='btn-primary full-width'
                onClick={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>

              <p className='resend-link'>
                Didn't receive it?{' '}
                <span className='text-gradient pointer' onClick={handleResend}>
                  Resend
                </span>
              </p>

              <button
                className='back-link'
                onClick={() => {
                  setStep(1)
                  setError('')
                }}
              >
                Change Number
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
