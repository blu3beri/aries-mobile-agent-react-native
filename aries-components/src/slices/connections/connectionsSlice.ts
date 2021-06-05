import { createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit'
import { ConnectionRecord, ConnectionInvitationMessage } from 'aries-framework'
import { ConnectionThunks } from './connectionsThunks'

interface ConnectionsState {
  connections: {
    records: ConnectionRecord[]
    isLoading: boolean
  }
  invitation: {
    message: null | ConnectionInvitationMessage,
    connectionRecordId: null | string,
    isLoading: boolean
  }
  error: null | SerializedError
}

const initialState: ConnectionsState = {
  connections: {
    records: [],
    isLoading: false
  },
  invitation: {
    message: null,
    connectionRecordId: null,
    isLoading: false
  },
  error: null
}

const connectionsSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    updateOrAdd: (state, action: PayloadAction<ConnectionRecord>) => {
      const index = state.connections.records.findIndex((record: ConnectionRecord) => {
        record.id == action.payload.id
      })

      if (index == -1) {
        // records doesn't exist, add it
        state.connections.records.push(action.payload)
        return state
      }

      // record does exist, update it
      state.connections.records[index] = action.payload
      return state
    }

  },
  extraReducers: (builder) => {
    builder
      // fetchAllConnections
      .addCase(ConnectionThunks.fetchAllConnections.pending, (state) => {
        state.connections.isLoading = true
      })
      .addCase(ConnectionThunks.fetchAllConnections.rejected, (state, action) => {
        state.connections.isLoading = false
        state.error = action.error
      })
      .addCase(ConnectionThunks.fetchAllConnections.fulfilled, (state, action) => {
        state.connections.isLoading = false
        state.connections.records = action.payload
      })
      // createConnection
      .addCase(ConnectionThunks.createConnection.pending, (state) => {
        state.invitation.isLoading = true
      })
      .addCase(ConnectionThunks.createConnection.rejected, (state, action) => {
        state.invitation.isLoading = false
        state.error = action.error
      })
      .addCase(ConnectionThunks.createConnection.fulfilled, (state, action) => {
        state.invitation.isLoading = false
        state.invitation.message = action.payload.invitation
        state.invitation.connectionRecordId = action.payload.connectionRecord.id
        state.connections.records.push(action.payload.connectionRecord)
      })
      // receiveInvitation
      .addCase(ConnectionThunks.receiveInvitation.pending, (state) => {
        state.invitation.isLoading = true
      })
      .addCase(ConnectionThunks.receiveInvitation.rejected, (state, action) => {
        state.invitation.isLoading = false
        state.error = action.error
      })
      .addCase(ConnectionThunks.receiveInvitation.fulfilled, (state, action) => {
        state.invitation.isLoading = false
      })
      // receiveInvitationFromUrl
      .addCase(ConnectionThunks.receiveInvitationFromUrl.pending, (state) => {
        state.invitation.isLoading = true
      })
      .addCase(ConnectionThunks.receiveInvitationFromUrl.rejected, (state, action) => {
        state.invitation.isLoading = false
        state.error = action.error
      })
      .addCase(ConnectionThunks.receiveInvitationFromUrl.fulfilled, (state) => {
        state.invitation.isLoading = false
      })
      // acceptInvitation
      .addCase(ConnectionThunks.acceptInvitation.pending, (state) => {
        state.invitation.isLoading = true
      })
      .addCase(ConnectionThunks.acceptInvitation.rejected, (state, action) => {
        state.invitation.isLoading = false
        state.error = action.error
      })
      .addCase(ConnectionThunks.acceptInvitation.fulfilled, (state) => {
        state.invitation.isLoading = false
      })

  },
})

export { connectionsSlice }

export type { ConnectionsState }