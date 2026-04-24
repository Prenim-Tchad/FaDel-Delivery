import 'package:flutter/material.dart';
import 'services/api_client.dart';

void main() {
  runApp(const MaterialApp(home: FaDelStatusPage()));
}

class FaDelStatusPage extends StatefulWidget {
  const FaDelStatusPage({super.key});

  @override
  State<FaDelStatusPage> createState() => _FaDelStatusPageState();
}

class _FaDelStatusPageState extends State<FaDelStatusPage> {
  String _message = "Vérification...";
  Color _statusColor = Colors.grey;

  @override
  void initState() {
    super.initState();
    _testLiaison();
  }

  Future<void> _testLiaison() async {
    final result = await ApiClient.checkHealth();
    setState(() {
      if (result['status'] == 'UP') {
        _message = "✅ Liaison Établie (Backend : 3001)";
        _statusColor = Colors.green;
      } else {
        _message = "❌ Échec de liaison";
        _statusColor = Colors.red;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.swap_horizontal_circle, size: 80, color: _statusColor),
            const SizedBox(height: 20),
            Text(_message, style: TextStyle(fontSize: 18, color: _statusColor, fontWeight: FontWeight.bold)),
            const SizedBox(height: 30),
            ElevatedButton(
              onPressed: _testLiaison,
              child: const Text("Tester à nouveau"),
            ),
          ],
        ),
      ),
    );
  }
}