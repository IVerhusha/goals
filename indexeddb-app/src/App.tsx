import { useState, useEffect, ChangeEvent } from 'react';
import { openDB, IDBPDatabase } from 'idb';

// Определяем интерфейс для элементов
interface Item {
  id?: number;
  name: string;
}

// Определяем тип базы данных
type MyDB = {
  items: Item;
};

function IndexedDBApp() {
  const [items, setItems] = useState<Item[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [updateValue, setUpdateValue] = useState<string>('');
  const [updateId, setUpdateId] = useState<number | null>(null);

  // Открытие или создание базы данных
  const openDatabase = async (): Promise<IDBPDatabase<MyDB>> => {
    return await openDB<MyDB>('my-database', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('items')) {
          db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  };

  // Добавление элемента в базу данных
  const addItem = async (item: string) => {
    const db = await openDatabase();
    const tx = db.transaction('items', 'readwrite');
    const store = tx.objectStore('items');
    await store.add({ name: item });
    await tx.done;
    fetchItems(); // Обновляем список после добавления
  };

  // Получение всех элементов
  const fetchItems = async () => {
    const db = await openDatabase();
    const tx = db.transaction('items', 'readonly');
    const store = tx.objectStore('items');
    const allItems = await store.getAll();
    setItems(allItems);
  };

  // Удаление элемента по ID
  const deleteItem = async (id: number) => {
    const db = await openDatabase();
    const tx = db.transaction('items', 'readwrite');
    const store = tx.objectStore('items');
    await store.delete(id);
    await tx.done;
    fetchItems(); // Обновляем список после удаления
  };

  // Обновление элемента по ID
  const updateItem = async (id: number, newName: string) => {
    const db = await openDatabase();
    const tx = db.transaction('items', 'readwrite');
    const store = tx.objectStore('items');
    await store.put({ id, name: newName });
    await tx.done;
    fetchItems(); // Обновляем список после обновления
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>IndexedDB with idb in React + TypeScript</h1>

      {/* Добавление элемента */}
      <input
        type="text"
        value={inputValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
        placeholder="Enter new item"
      />
      <button onClick={() => addItem(inputValue)}>Add Item</button>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.id}: {item.name}
            <button onClick={() => deleteItem(item.id!)}>Delete</button>
            <button
              onClick={() => {
                setUpdateId(item.id!);
                setUpdateValue(item.name);
              }}
            >
              Update
            </button>
          </li>
        ))}
      </ul>

      {/* Обновление элемента */}
      {updateId && (
        <div>
          <input
            type="text"
            value={updateValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUpdateValue(e.target.value)}
          />
          <button onClick={() => updateItem(updateId, updateValue)}>Save Update</button>
        </div>
      )}
    </div>
  );
}

export default IndexedDBApp;
