import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Address extends Document {
  @Prop()
  country: string;
  @Prop()
  street: string;
  @Prop()
  city: string;
  @Prop()
  zip: number;
}
export const AddressSchema = SchemaFactory.createForClass(Address);

// export interface IAddress {
//   country: string;
//   street: string;
//   city: string;
//   zip: number;
// }

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({  })
  firstName: string;

  @Prop({  })
  lastName: string;

  @Prop({ })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({  })
  password: string;

  @Prop({ unique: true })
  phoneNumber: string;

  @Prop({
    default:
      'https://res.cloudinary.com/dqrid1fi3/image/upload/v1729230344/kwrifwuycusuohxopa8j.jpg',
  })
  image: string;

  @Prop({
    type: AddressSchema,
    default: { street: '', city: '', country: 'Egypt', zip: 0 },
  })
  address: Address;

  @Prop({ 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  })
  roles: string;

  @Prop({ unique: true })
  idToken: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
