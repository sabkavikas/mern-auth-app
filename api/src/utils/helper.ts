import { createObjectCsvWriter } from 'csv-writer'

export function generateCSV(users:any) {
    const csvWriter = createObjectCsvWriter({
        path: 'users.csv',
        header: [
            { id: 'id', title: 'ID' },
            { id: 'name', title: 'Name' },
            { id: 'email', title: 'Email' },
            { id: 'gender', title: 'Gender' },
            { id: 'phone', title: 'Phone' },
            { id: 'profilePic', title: 'Profile Pic' },
            { id: 'status', title: 'Status' },
            { id: 'date', title: 'Date' },
        ],
    });
    return csvWriter.writeRecords(users);
}