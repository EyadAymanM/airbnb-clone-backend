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
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
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
}

export const UserSchema = SchemaFactory.createForClass(User);
