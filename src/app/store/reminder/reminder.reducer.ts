import { createReducer, on } from '@ngrx/store';
import { IReminder } from 'src/app/utils/interfaces/reminder.interface';
import { addReminder, editReminder, deleteAllReminders } from './reminder.actions';
import { findReminderIndex } from 'src/app/utils/functions/reminder-insert-index.function';

/**
 * The reminder feature key
 */
export const reminderFeatureKey = 'reminders';

/**
 * Represents the reminder feature state
 */
export type RemindersState = {
  [key: number]: {
    [key: number]: {
      [key: number]: IReminder[];
    };
  };
};

/**
 * Initial state for reminders
 */
export const initialState: RemindersState = {};

/**
 * The reminders reducer
 */
export const remindersReducer = createReducer(
  initialState,
  on(deleteAllReminders, (state, action) => {
    const yearData = state[action.year];
    const monthData = yearData[action.month];

    return {
      ...state,
      [action.year]: {
        ...yearData,
        [action.month]: {
          ...monthData,
          [action.day]: []
        }
      }
    };
  }),

  on(addReminder, (state, action) => {

    const yearData = state[action.year] || {};
    const monthData = yearData[action.month] || {};
    const dayData = monthData[action.day] || [];

    const copy = [...dayData];
    const reminderPosition = findReminderIndex(action.reminder, copy);
    copy.splice(reminderPosition.index || 0, 0, action.reminder);

    return {
      ...state,
      [action.year]: {
        ...yearData,
        [action.month]: {
          ...monthData,
          [action.day]: copy
        }
      }
    };
  }),

  on(editReminder, (state, action) => {
    const yearData = state[action.year];
    const monthData = yearData[action.month];
    const dayData = monthData[action.day];

    const copy = [...dayData];
    const savedReminder = copy[action.index];

    if (action.reminder.time === savedReminder.time) {
      copy[action.index] = action.reminder;
    } else {
      copy.splice(action.index, 1);
      const reminderPosition = findReminderIndex(action.reminder, copy);
      copy.splice(reminderPosition.index || 0, 0, action.reminder);
    }

    return {
      ...state,
      [action.year]: {
        ...yearData,
        [action.month]: {
          ...monthData,
          [action.day]: copy
        }
      }
    };
  })
);
