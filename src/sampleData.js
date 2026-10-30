// Offline fallback so the UI can still be demoed if the API is unreachable.
// Shaped like the live response and run through the same normalizer.
export const sampleResponse = [
  {
    request_id: "E85012",
    from_address:
      "Ejipura Main Road, Viveknagar Further Extension, Gowda Muniswamy Garden, Viveka Nagar, Bengaluru, Karnataka, 560047",
    to_address: "Hsr Bda Complex, 12th Main Road, Sector 6, HSR Layout, Bengaluru, Karnataka, 560047",
    property_size: "3 BHK",
    total_items: 26,
    distance: "5.9 km",
    moving_on: "2021-10-28T17:00:00",
    is_flexible: true,
    additional_info: "Test Data",
    old_floor_no: 11,
    old_elevator_availability: true,
    old_parking_distance: "11",
    new_floor_no: 11,
    new_elevator_availability: true,
    new_parking_distance: "11",
    items: {
      inventory: [
        {
          displayName: "Furniture",
          category: [
            {
              displayName: "Sofa",
              items: [
                { displayName: "1 Seater Sofa", qty: 1, type: [{ displayName: "Wooden", selected: true }] },
                { displayName: "2 Seater Sofa", qty: 1, type: [{ displayName: "Wooden", selected: true }] },
                { displayName: "3 Seater Sofa", qty: 1, type: [{ displayName: "Fabric", selected: true }] },
                { displayName: "Sofa cum bed", qty: 1 },
                { displayName: "Sectional Sofa", qty: 1, size: "4 Piece" },
                { displayName: "Sofa Footrest", qty: 1 },
                { displayName: "Ottoman", qty: 1 },
              ],
            },
            {
              displayName: "Table",
              items: [
                { displayName: "Centre / Coffee", qty: 1, type: [{ displayName: "Glass", selected: true }] },
                { displayName: "Teapoy", qty: 1, type: [{ displayName: "Glass", selected: true }] },
                { displayName: "Side Table", qty: 1, type: [{ displayName: "Glass", selected: true }] },
                {
                  displayName: "4 Seater Dining Table",
                  qty: 1,
                  type: [
                    { displayName: "Metal", selected: true },
                    { displayName: "Dismantlable", selected: true },
                  ],
                },
                {
                  displayName: "6 Seater Dining Table",
                  qty: 1,
                  type: [
                    { displayName: "Glass", selected: true },
                    { displayName: "Dismantlable", selected: true },
                  ],
                },
                { displayName: "Iron Board", qty: 1 },
                { displayName: "Plastic Table", qty: 1 },
                { displayName: "Drafting Table", qty: 1 },
              ],
            },
          ],
        },
        {
          displayName: "Electronics",
          category: [
            {
              displayName: "Appliances",
              items: [
                { displayName: "Refrigerator", qty: 1 },
                { displayName: "Washing Machine", qty: 1 },
                { displayName: "Television", qty: 2 },
                { displayName: "Microwave Oven", qty: 1 },
                { displayName: "Air Conditioner", qty: 4 },
              ],
            },
          ],
        },
        {
          displayName: "Vehicle",
          category: [{ displayName: "Two Wheeler", items: [{ displayName: "Scooter", qty: 1 }] }],
        },
        {
          displayName: "Boxes/Trolley",
          category: [{ displayName: "Boxes", items: [{ displayName: "Medium Box", qty: 13 }] }],
        },
        {
          displayName: "Custom Items",
          category: [{ displayName: "Others", items: [{ displayName: "Treadmill", qty: 1 }] }],
        },
      ],
    },
  },
  {
    request_id: "E21418",
    from_address: "Ejipura, Bengaluru, Karnataka",
    to_address: "HSR Layout, Bengaluru, Karnataka",
    property_size: "1 BHK",
    total_items: 32,
    distance: "4.8 km",
    moving_on: "2020-09-26T18:18:00",
    is_flexible: true,
    additional_info: "",
    old_floor_no: 2,
    old_elevator_availability: false,
    old_parking_distance: "20",
    new_floor_no: 4,
    new_elevator_availability: true,
    new_parking_distance: "8",
    items: { inventory: [] },
  },
];
