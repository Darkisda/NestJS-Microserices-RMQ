import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TaskType = Task & Document;

@Schema({
  _id: true,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Task {
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: false, default: true })
  open: boolean;

  @Prop({ required: true })
  user_id: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
