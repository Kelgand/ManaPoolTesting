import React from 'react';

interface CredentialsFormProps {
  email: string;
  apiKey: string;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onApiKeyChange: (apiKey: string) => void;
  onSubmit: () => void;
}

export const CredentialsForm: React.FC<CredentialsFormProps> = ({
  email,
  apiKey,
  loading,
  onEmailChange,
  onApiKeyChange,
  onSubmit,
}) => {
  return (
    <div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Your Mana Pool email"
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>API Key (not saved, only used in memory for API calls):</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="Your Mana Pool API key"
          className="form-input"
        />
      </div>
      
      <button 
        onClick={onSubmit} 
        disabled={loading}
        className="primary-button"
      >
        {loading ? 'Loading...' : 'Get Recent Orders'}
      </button>
    </div>
  );
};