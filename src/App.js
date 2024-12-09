import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Swal from "sweetalert2";
import axios from "axios";

function App() {
  const [nip, setNip] = useState("");
  const [qrData, setQrData] = useState("");
  const [employeeName, setEmployeeName] = useState(""); 
  const [loading, setLoading] = useState(false);

  const checkNip = async () => {
    if (!nip.trim()) {
      Swal.fire("Error", "Harap masukkan NIP yang valid.", "error");
      return false;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.sigap.solutions/no-auth/pegawai/check-nip",
        { nip },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);

      if (response.status === 200) {
        const namaPegawai = response.data.records.nama_pegawai;
        setEmployeeName(namaPegawai); 
        Swal.fire("NIP Ditemukan", `Data milik: ${namaPegawai}`, "success");
        return true;
      }
    } catch (error) {
      setLoading(false);
      Swal.fire("NIP Tidak Ditemukan", "NIP tidak terdaftar.", "error");
      return false;
    }
  };

  const generateQR = async () => {
    const isValid = await checkNip();
    if (isValid) {
      setQrData(nip);
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById("qrCode");
    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${nip}.png`;
    link.click();
  };

  return (
    <div className="container mt-5 text-center flex justify-content-center">
      <div className="judul">SILAHKAN MASUKKAN NOMOR INDUK PEGAWAI</div>

      <div className="search-container mb-3 d-flex justify-content-center">
        <input
          type="text"
          className="form-control"
          placeholder="Masukkan NIP"
          value={nip}
          onChange={(e) => setNip(e.target.value)}
        />
      </div>

      <button
        className="btn btn-primary mb-4"
        onClick={generateQR}
        disabled={loading}
      >
        {loading ? "Memeriksa..." : "Generate QR"}
      </button>

      {qrData && (
        <div className="mt-4">
          <QRCodeCanvas
            id="qrCode"
            value={qrData}
            size={200}
            className="mb-4"
          />
          <p>
           <button className="btn btn-success mt-2" onClick={downloadQR}>
            Download QR
          </button>
        </p>
          <p className="nip mt-2 text-center d-flex">
             NIP <span className="titikdua">:</span> <strong>{qrData}</strong>
          </p>
          <p className="pegawaii mt-1 text-center d-flex">
            Nama Pegawai <span className="titiksatu">: </span> <strong>{employeeName}</strong>
          </p>
         
          <p className="mt-5">
      <em>"Silahkan ke <strong> Ruang Command Center Registrasi Biometrik </strong>"</em>
    </p>
        </div>
      )}
    </div>
  );
}

export default App;
