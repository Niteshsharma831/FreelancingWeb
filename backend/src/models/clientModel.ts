import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClient extends Document {
  name: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  role: string;
  profileCompleted: boolean;
  profile: {
    phone?: string;
    address?: string;
    profilePic?: string;
    verified?: boolean;
    skills?: string[];
    resume?: {
      url: string;
      format: 'pdf' | 'docx' | 'jpg' | 'png';
      uploadedAt?: Date;
    };
    bio?: string;
    hourlyRate?: number;
    experience?: 'beginner' | 'intermediate' | 'expert';
  };
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema: Schema<IClient> = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [50, "Name cannot exceed 50 characters"]
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: "Gender must be male, female, or other"
    },
    required: [true, "Gender is required"],
    lowercase: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"]
  },
  role: {
    type: String,
    default: "client",
    enum: ["client", "freelancer", "admin"]
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  profile: {
    phone: {
      type: String,
      match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"]
    },
    address: {
      type: String,
      maxlength: [200, "Address cannot exceed 200 characters"]
    },
    profilePic: {
      type: String,
      default: ""
    },
    verified: {
      type: Boolean,
      default: false
    },
    skills: [{
      type: String,
      trim: true
    }],
    resume: {
      url: String,
      format: {
        type: String,
        enum: ['pdf', 'docx', 'jpg', 'png']
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"]
    },
    hourlyRate: {
      type: Number,
      min: [0, "Hourly rate cannot be negative"]
    },
    experience: {
      type: String,
      enum: ['beginner', 'intermediate', 'expert']
    }
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret: Record<string, any>) {
      // Remove mongoose internal fields
      delete ret.__v;
      // Convert _id to id
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function(doc, ret: Record<string, any>) {
      delete ret.__v;
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    }
  }
});

// Index for faster queries
// ClientSchema.index({ email: 1 });
ClientSchema.index({ role: 1 });
ClientSchema.index({ 'profile.verified': 1 });
ClientSchema.index({ createdAt: -1 });

// Virtual for full name
ClientSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual for id
ClientSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Pre-save middleware
ClientSchema.pre('save', function(next) {
  // Capitalize name
  if (this.name) {
    this.name = this.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  // Set profileCompleted based on profile data
  if (this.profile && this.profile.phone && this.profile.address) {
    this.profileCompleted = true;
  }
  
  next();
});

// Pre-find middleware to add id field
ClientSchema.pre('find', function() {
  this.select('-__v');
});

ClientSchema.pre('findOne', function() {
  this.select('-__v');
});

const Client: Model<IClient> = mongoose.model<IClient>("Client", ClientSchema);

export default Client;