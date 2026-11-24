// Kurze Rückmeldungen ("Screenshot gespeichert" …)

export const toast = $state({ message: '', id: 0 });

let timer;
export function notify(message, ms = 2600) {
	toast.message = message;
	toast.id++;
	clearTimeout(timer);
	timer = setTimeout(() => (toast.message = ''), ms);
}
