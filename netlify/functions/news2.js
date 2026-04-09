const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    const res = await fetch("https://osbaianosrevista.com.br/");

    if (!res.ok) {
      throw new Error(`Erro ao acessar o site: ${res.status}`);
    }

    const html = await res.text();

    const regex =
      /data-src="(https:\/\/osbaianosrevista\.com\.br\/[^"]+)"[\s\S]*?<h2 class="wpr-grid-item-title[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([^<]+)</gi;

    const noticias = [];
    let match;

    while ((match = regex.exec(html)) !== null && noticias.length < 3) {
      noticias.push({
        imagem: match[1] || "",
        link: match[2] || "",
        titulo: match[3] || "Sem título"
      });
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(noticias)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        erro: "Erro ao buscar notícias",
        detalhe: error.message
      })
    };
  }
};
