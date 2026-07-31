import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";

// ======================================================
// COMPANY CONFIGURATION
// ======================================================

const COMPANY = {

    name: "MANIKYA GOLD",

    tagline: "Premium Gold & Silver Jewellery",

    address:
        "Shahdol, Madhya Pradesh, India",

    phone:
        "+91-9876543210",

    email:
        "support@manikyagold.com",

    website:
        "www.manikyagold.com",

    gstin:
        "23ABCDE1234F1Z5",

    pan:
        "ABCDE1234F",

    bank:
        "State Bank of India",

    account:
        "XXXXXXXXXXXX",

    ifsc:
        "SBIN000000",

};

// ======================================================
// COLORS
// ======================================================

const COLORS = {

    primary: "#B8860B",

    secondary: "#444444",

    light: "#F6F6F6",

    border: "#DDDDDD",

    white: "#FFFFFF",

    black: "#000000",

};

// ======================================================
// HELPERS
// ======================================================

const money = (amount = 0) => {

    return `₹ ${Number(amount).toFixed(2)}`;

};

const line = (doc, y) => {

    doc.moveTo(40, y)
        .lineTo(555, y)
        .strokeColor(COLORS.border)
        .stroke();

};

const writeLabel = (

    doc,

    label,

    value,

    x,

    y

) => {

    doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(COLORS.secondary)
        .text(label, x, y);

    doc
        .font("Helvetica")
        .fillColor(COLORS.black)
        .text(value || "-", x + 90, y);

};

// ======================================================
// LOGO
// ======================================================

const drawLogo = (doc) => {

    try {

        const logoPath = path.join(

            process.cwd(),

            "src",

            "assets",

            "logo.png"

        );

        if (fs.existsSync(logoPath)) {

            doc.image(

                logoPath,

                40,

                30,

                {

                    width: 70,

                }

            );

        }

    } catch {

        // ignore if logo missing

    }

};

// ======================================================
// HEADER
// ======================================================

const drawHeader = (doc, order) => {

    drawLogo(doc);

    doc

        .font("Helvetica-Bold")

        .fontSize(22)

        .fillColor(COLORS.primary)

        .text(

            COMPANY.name,

            130,

            35

        );

    doc

        .font("Helvetica")

        .fontSize(10)

        .fillColor(COLORS.secondary)

        .text(

            COMPANY.tagline,

            130,

            60

        );

    doc

        .fontSize(9)

        .text(

            COMPANY.address,

            130,

            78

        );

    doc.text(

        `Phone : ${COMPANY.phone}`,

        130,

        92

    );

    doc.text(

        `Email : ${COMPANY.email}`,

        130,

        105

    );

    doc.text(

        `GSTIN : ${COMPANY.gstin}`,

        400,

        35

    );

    doc.text(

        `PAN : ${COMPANY.pan}`,

        400,

        50

    );

    doc

        .font("Helvetica-Bold")

        .fontSize(20)

        .fillColor(COLORS.black)

        .text(

            "TAX INVOICE",

            380,

            82

        );

    line(doc, 135);

    writeLabel(

        doc,

        "Invoice No",

        order.invoiceNumber,

        40,

        150

    );

    writeLabel(

        doc,

        "Order No",

        order.orderNumber,

        40,

        168

    );

    writeLabel(

        doc,

        "Invoice Date",

        new Date().toLocaleDateString(),

        40,

        186

    );

    writeLabel(

        doc,

        "Payment",

        order.paymentMethod,

        320,

        150

    );

    writeLabel(

        doc,

        "Status",

        order.paymentStatus,

        320,

        168

    );

    writeLabel(

        doc,

        "Order Status",

        order.orderStatus,

        320,

        186

    );

    line(doc, 215);

};

// ======================================================
// CUSTOMER DETAILS
// ======================================================

const drawCustomer = (doc, order) => {

    doc

        .font("Helvetica-Bold")

        .fontSize(13)

        .fillColor(COLORS.primary)

        .text(

            "BILL TO",

            40,

            225

        );

    doc

        .font("Helvetica")

        .fontSize(10)

        .fillColor(COLORS.black);

    const s = order.shippingAddress;

    doc.text(

        s.fullName,

        40,

        248

    );

    doc.text(

        s.house,

        40,

        264

    );

    doc.text(

        s.area,

        40,

        280

    );

    doc.text(

        `${s.city}, ${s.state}`,

        40,

        296

    );

    doc.text(

        s.pincode,

        40,

        312

    );

    doc.text(

        s.phone,

        40,

        328

    );

};
// ======================================================
// PRODUCT TABLE
// ======================================================

const TABLE = {

    startY: 365,

    rowHeight: 28,

    columns: {

        no: 40,

        product: 65,

        metal: 215,

        purity: 275,

        weight: 335,

        qty: 390,

        price: 435,

        amount: 505,

    },

};

// ======================================================
// Draw Table Header
// ======================================================

const drawTableHeader = (doc, y) => {

    doc
        .fillColor(COLORS.primary)
        .rect(
            40,
            y,
            515,
            24
        )
        .fill();

    doc
        .fillColor("white")
        .font("Helvetica-Bold")
        .fontSize(9);

    doc.text("#", TABLE.columns.no, y + 7);

    doc.text(
        "Product",
        TABLE.columns.product,
        y + 7
    );

    doc.text(
        "Metal",
        TABLE.columns.metal,
        y + 7
    );

    doc.text(
        "Purity",
        TABLE.columns.purity,
        y + 7
    );

    doc.text(
        "Weight",
        TABLE.columns.weight,
        y + 7
    );

    doc.text(
        "Qty",
        TABLE.columns.qty,
        y + 7
    );

    doc.text(
        "Rate",
        TABLE.columns.price,
        y + 7
    );

    doc.text(
        "Amount",
        TABLE.columns.amount,
        y + 7
    );

};



// ======================================================
// Draw Single Row
// ======================================================

const drawRow = (

    doc,

    item,

    index,

    y

) => {

    const amount =
        item.price *
        item.quantity;

    doc

        .font("Helvetica")

        .fontSize(9)

        .fillColor(COLORS.black);

    doc.text(
        index + 1,
        TABLE.columns.no,
        y + 8
    );

    doc.text(
        item.name,
        TABLE.columns.product,
        y + 8,
        {
            width: 140,
        }
    );

    doc.text(
        item.metal || "-",
        TABLE.columns.metal,
        y + 8
    );

    doc.text(
        item.purity || "-",
        TABLE.columns.purity,
        y + 8
    );

    doc.text(
        `${item.weight} g`,
        TABLE.columns.weight,
        y + 8
    );

    doc.text(
        item.quantity,
        TABLE.columns.qty,
        y + 8
    );

    doc.text(
        money(item.price),
        TABLE.columns.price,
        y + 8
    );

    doc.text(
        money(amount),
        TABLE.columns.amount,
        y + 8
    );

    doc

        .strokeColor(COLORS.border)

        .moveTo(
            40,
            y + 27
        )

        .lineTo(
            555,
            y + 27
        )

        .stroke();

};



// ======================================================
// Draw Complete Table
// ======================================================

const drawProducts = (

    doc,

    order

) => {

    let y =
        TABLE.startY;

    drawTableHeader(
        doc,
        y
    );

    y += 24;

    let grandTotal = 0;

    order.items.forEach(

        (
            item,
            index
        ) => {

            if (y > 720) {

                doc.addPage();

                y = 60;

                drawTableHeader(
                    doc,
                    y
                );

                y += 24;

            }

            drawRow(

                doc,

                item,

                index,

                y

            );

            grandTotal +=
                item.price *
                item.quantity;

            y +=
                TABLE.rowHeight;

        }

    );

    return {

        y,

        grandTotal,

    };

};

// ======================================================
// TOTALS
// ======================================================

const drawTotals = (doc, order, y) => {

    doc.y = y + 20;

    doc
        .font("Helvetica-Bold")
        .fontSize(12);

    doc.text(
        `Subtotal : ${money(order.subtotal)}`,
        350,
        doc.y,
        { width: 170, align: "right" }
    );

    doc.text(
        `Discount : ${money(order.discount)}`,
        350,
        doc.y + 18,
        { width: 170, align: "right" }
    );

    doc.text(
        `GST : ${money(order.gst)}`,
        350,
        doc.y + 36,
        { width: 170, align: "right" }
    );

    doc.text(
        `Shipping : ${money(order.shippingCharge)}`,
        350,
        doc.y + 54,
        { width: 170, align: "right" }
    );

    doc
        .fontSize(15)
        .fillColor(COLORS.primary);

    doc.text(
        `Grand Total : ${money(order.totalAmount)}`,
        320,
        doc.y + 85,
        { width: 200, align: "right" }
    );

};

    // ======================================================
// FOOTER
// ======================================================

const drawFooter = (doc) => {

    doc.moveDown(4);

    line(doc, doc.y);

    doc.moveDown();

    doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(COLORS.secondary);

    doc.text(
        COMPANY.website,
        { align: "center" }
    );

    doc.text(
        COMPANY.email,
        { align: "center" }
    );

    doc.text(
        COMPANY.phone,
        { align: "center" }
    );

    doc.moveDown();

    doc.text(
        "Thank you for shopping with MANIKYA GOLD.",
        { align: "center" }
    );

    doc.text(
        "This is a computer generated GST Invoice.",
        { align: "center" }
    );

};

   // ======================================================
// EXPORT
// ======================================================

const generateInvoice = (order) => {

    const doc = new PDFDocument({
        size: "A4",
        margin: 40,
    });

    drawHeader(doc, order);

    drawCustomer(doc, order);

    const table = drawProducts(doc, order);

    drawTotals(doc, order, table.y);

    drawFooter(doc, order);

    doc.end();

    return doc;
};

export default generateInvoice;