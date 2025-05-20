const filePath = "./data.JSON";

export async function deleteGif(username, gifUrl) {
  const data = await Deno.readTextFile(filePath);
  const users = JSON.parse(data);

  const user = users.find(u => u.username === username);
  if (!user) return `Användare '${username}' hittades inte.`;

  const i = user.savedGifs.indexOf(gifUrl);
  if (i === -1) return `GIF '${gifUrl}' finns inte.`;

  user.savedGifs.splice(i, 1);
  await Deno.writeTextFile(filePath, JSON.stringify(users, null, 2));

  return `GIF '${gifUrl}' togs bort.`;
}